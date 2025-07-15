import { Injectable } from '@nestjs/common';
import { CreateInstituteDto } from './dto/create-institute.dto';
import { UpdateInstituteDto } from './dto/update-institute.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Institute, InstituteStatus } from 'src/typeorm/entities';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { successResponse } from 'src/common/response/response.util';

@Injectable()
export class InstituteService {
  constructor(
    @InjectRepository(Institute)
    private instituteRepository: Repository<Institute>,
  ) {}

  async create(createInstituteDto: CreateInstituteDto) {
    console.log('Creating institute with data:', createInstituteDto);
    const institute = await this.instituteRepository.save({
      ...createInstituteDto,
      id: uuidv4(),
      status: InstituteStatus.ACTIVE,
      ruc: 'ssss',
    });

    return successResponse(institute);
  }

  findAll() {
    return `This action returns all institute`;
  }

  async findOne(id: number) {
    console.log(id);
    const institute = await this.instituteRepository.find();
    console.log('perrito');
    console.log(institute);
    console.log('perrito');
    return institute;
  }

  update(id: number, updateInstituteDto: UpdateInstituteDto) {
    console.log(
      'Updating institute with ID:',
      id,
      'and data:',
      updateInstituteDto,
    );
    return `This action updates a #${id} institute`;
  }

  remove(id: number) {
    return `This action removes a #${id} institute`;
  }
}
