import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateLostPetDto } from './dto/create-lost-pet.dto';
import { LostPetsService } from './lost-pets.service';

@Controller('lost-pets')
export class LostPetsController {
  constructor(private readonly lostPetsService: LostPetsService) {}

  @Get()
  async getLostPets() {
    return {
      data: await this.lostPetsService.findActiveLostPets(),
    };
  }

  @Post()
  async createLostPet(@Body() createLostPetDto: CreateLostPetDto) {
    const lostPet = await this.lostPetsService.createLostPet(createLostPetDto);
    return {
      message: 'Lost pet registered successfully',
      data: lostPet,
    };
  }
}
