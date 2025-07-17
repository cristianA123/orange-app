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

  async findAll() {
    const institute = await this.instituteRepository.find();

    return successResponse(institute);
  }

  async findOne(id: string) {
    console.log(id);
    const institute = await this.instituteRepository.findOne({
      where: { id },
    });
    console.log('perrito');
    console.log(institute);
    console.log('perrito');

    return successResponse(institute);
  }

  async update(id: number, updateInstituteDto: UpdateInstituteDto) {
    await this.instituteRepository.update(
      { id: id.toString() },
      { ...updateInstituteDto, id: id.toString() },
    );
    return successResponse({});
  }

  async remove(id: string) {
    console.log('delete');
    console.log(id);
    console.log('delete');
    const institute = await this.instituteRepository.update(
      { id: id.toString() },
      { status: InstituteStatus.DELETED, deletedAt: new Date() },
    );
    console.log('deeeeeee');
    return successResponse(institute);
  }
}
