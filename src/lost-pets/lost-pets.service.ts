import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Point } from 'typeorm';
import { cacheKeys } from 'src/core/cache/cache.keys';
import { RedisCacheService } from 'src/core/cache/redis-cache.service';
import { LostPet } from 'src/core/entities/lost-pet.entity';
import { Repository } from 'typeorm';
import { CreateLostPetDto } from './dto/create-lost-pet.dto';

@Injectable()
export class LostPetsService {
  constructor(
    @InjectRepository(LostPet)
    private readonly lostPetsRepository: Repository<LostPet>,
    private readonly cacheService: RedisCacheService,
  ) {}

  async findActiveLostPets(): Promise<LostPet[]> {
    const cachedPets = await this.cacheService.get<LostPet[]>(cacheKeys.lostPets);
    if (cachedPets) {
      return cachedPets;
    }

    const pets = await this.lostPetsRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });

    await this.cacheService.set(cacheKeys.lostPets, pets);
    return pets;
  }

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

    const savedLostPet = await this.lostPetsRepository.save(lostPet);
    await this.cacheService.del(cacheKeys.lostPets);
    return savedLostPet;
  }
}
