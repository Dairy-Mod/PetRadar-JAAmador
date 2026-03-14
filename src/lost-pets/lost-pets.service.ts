import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Point } from 'typeorm';
import { LostPet } from 'src/core/entities/lost-pet.entity';
import { Repository } from 'typeorm';
import { CreateLostPetDto } from './dto/create-lost-pet.dto';

@Injectable()
export class LostPetsService {
  constructor(
    @InjectRepository(LostPet)
    private readonly lostPetsRepository: Repository<LostPet>,
  ) {}

  async createLostPet(createLostPetDto: CreateLostPetDto): Promise<LostPet> {
    const ownerName = createLostPetDto.ownerName ?? createLostPetDto.owner_name ?? '';
    const ownerEmail = createLostPetDto.ownerEmail ?? createLostPetDto.owner_email ?? '';
    const ownerPhone = createLostPetDto.ownerPhone ?? createLostPetDto.owner_phone ?? '';
    const photoUrl = createLostPetDto.photoUrl ?? createLostPetDto.photo_url ?? null;
    const lostDate = createLostPetDto.lostDate ?? createLostPetDto.lost_date ?? new Date().toISOString();
    const isActive = createLostPetDto.isActive ?? createLostPetDto.is_active ?? true;

    const location: Point = {
      type: 'Point',
      coordinates: [createLostPetDto.lng, createLostPetDto.lat],
    };

    const lostPet = this.lostPetsRepository.create({
      name: createLostPetDto.name,
      species: createLostPetDto.species,
      breed: createLostPetDto.breed,
      color: createLostPetDto.color,
      size: createLostPetDto.size,
      description: createLostPetDto.description,
      photoUrl,
      ownerName,
      ownerEmail,
      ownerPhone,
      location,
      address: createLostPetDto.address,
      lostDate: new Date(lostDate),
      isActive,
    });

    return this.lostPetsRepository.save(lostPet);
  }
}
