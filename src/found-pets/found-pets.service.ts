import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Point } from 'typeorm';
import { envs } from 'src/config/envs';
import { FoundPet } from 'src/core/entities/found-pet.entity';
import { LostPet } from 'src/core/entities/lost-pet.entity';
import { EmailOptions } from 'src/core/models/email-options.model';
import { EmailService } from 'src/email/email.service';
import { Repository } from 'typeorm';
import { CreateFoundPetDto } from './dto/create-found-pet.dto';
import { buildFoundPetMatchTemplate } from './templates/found-pet-match.template';

interface LostPetMatchResult {
  id: number;
  name: string;
  species: string;
  breed: string;
  color: string;
  size: string;
  description: string;
  owner_name: string;
  owner_email: string;
  owner_phone: string;
  address: string;
  lost_lat: number;
  lost_lng: number;
  distance: number | string;
}

@Injectable()
export class FoundPetsService {
  constructor(
    @InjectRepository(FoundPet)
    private readonly foundPetsRepository: Repository<FoundPet>,
    @InjectRepository(LostPet)
    private readonly lostPetsRepository: Repository<LostPet>,
    private readonly emailService: EmailService,
  ) {}

  async createFoundPet(createFoundPetDto: CreateFoundPetDto) {
    const finderName = createFoundPetDto.finderName ?? createFoundPetDto.finder_name ?? '';
    const finderEmail = createFoundPetDto.finderEmail ?? createFoundPetDto.finder_email ?? '';
    const finderPhone = createFoundPetDto.finderPhone ?? createFoundPetDto.finder_phone ?? '';
    const photoUrl = createFoundPetDto.photoUrl ?? createFoundPetDto.photo_url ?? null;
    const foundDate = createFoundPetDto.foundDate ?? createFoundPetDto.found_date ?? new Date().toISOString();

    const location: Point = {
      type: 'Point',
      coordinates: [createFoundPetDto.lng, createFoundPetDto.lat],
    };

    const foundPet = this.foundPetsRepository.create({
      species: createFoundPetDto.species,
      breed: createFoundPetDto.breed ?? null,
      color: createFoundPetDto.color,
      size: createFoundPetDto.size,
      description: createFoundPetDto.description,
      photoUrl,
      finderName,
      finderEmail,
      finderPhone,
      location,
      address: createFoundPetDto.address,
      foundDate: new Date(foundDate),
    });

    const savedFoundPet = await this.foundPetsRepository.save(foundPet);
    const matches = await this.findLostPetsWithinRadius(
      createFoundPetDto.lng,
      createFoundPetDto.lat,
    );
    const notifications = await this.notifyMatches(matches, createFoundPetDto);

    return {
      message: 'Found pet registered successfully',
      data: savedFoundPet,
      matchedLostPets: matches.length,
      notificationsSent: notifications,
    };
  }

  private async findLostPetsWithinRadius(
    lng: number,
    lat: number,
  ): Promise<LostPetMatchResult[]> {
    const query = `
      SELECT
        lp.id,
        lp.name,
        lp.species,
        lp.breed,
        lp.color,
        lp.size,
        lp.description,
        lp.owner_name,
        lp.owner_email,
        lp.owner_phone,
        lp.address,
        ST_Y(lp.location) AS lost_lat,
        ST_X(lp.location) AS lost_lng,
        ST_Distance(
          lp.location::geography,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
        ) AS distance
      FROM lost_pets lp
      WHERE lp.is_active = true
        AND ST_DWithin(
          lp.location::geography,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
          500
        )
      ORDER BY distance ASC;
    `;

    return this.lostPetsRepository.query(query, [lng, lat]);
  }

  private async notifyMatches(
    matches: LostPetMatchResult[],
    foundPet: CreateFoundPetDto,
  ): Promise<number> {
    let totalSent = 0;

    for (const match of matches) {
      const recipients = Array.from(
        new Set([match.owner_email, envs.NOTIFICATION_EMAIL].filter(Boolean)),
      ).join(',');
      const template = buildFoundPetMatchTemplate(
        {
          ...match,
          distance: Number(match.distance),
          lost_lat: Number(match.lost_lat),
          lost_lng: Number(match.lost_lng),
        },
        foundPet,
      );

      const options: EmailOptions = {
        to: recipients,
        subject: `PetRadar alert: possible match for ${match.name}`,
        htmlBody: template,
      };

      const sent = await this.emailService.sendEmail(options);
      if (sent) {
        totalSent += 1;
      }
    }

    return totalSent;
  }
}
