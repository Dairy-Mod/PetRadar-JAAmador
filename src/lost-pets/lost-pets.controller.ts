import { Body, Controller, Post } from '@nestjs/common';
import { CreateLostPetDto } from './dto/create-lost-pet.dto';
import { LostPetsService } from './lost-pets.service';

@Controller('lost-pets')
export class LostPetsController {
  constructor(private readonly lostPetsService: LostPetsService) {}

  @Post()
  async createLostPet(@Body() createLostPetDto: CreateLostPetDto) {
    const lostPet = await this.lostPetsService.createLostPet(createLostPetDto);
    return {
      message: 'Lost pet registered successfully',
      data: lostPet,
    };
  }
}
