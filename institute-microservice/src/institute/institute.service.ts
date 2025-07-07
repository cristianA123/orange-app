import { Injectable } from '@nestjs/common';
import { CreateInstituteDto } from './dto/create-institute.dto';
import { UpdateInstituteDto } from './dto/update-institute.dto';

@Injectable()
export class InstituteService {
  create(createInstituteDto: CreateInstituteDto) {
    console.log('Creating institute with data:', createInstituteDto);
    return 'This action adds a new institute';
  }

  findAll() {
    return `This action returns all institute`;
  }

  findOne(id: number) {
    return `This action returns a #${id} institute`;
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
