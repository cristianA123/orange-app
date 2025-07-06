import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InstituteService } from './institute.service';
import { CreateInstituteDto } from './dto/create-institute.dto';
import { UpdateInstituteDto } from './dto/update-institute.dto';

@Controller()
export class InstituteController {
  constructor(private readonly instituteService: InstituteService) {}

  // @MessagePattern({ cmd: 'getUserById' })

  @MessagePattern({ cmd: 'CREATE_INSTITUTE' })
  create(@Payload() createInstituteDto: CreateInstituteDto) {
    return { hola: 1, createInstituteDto };
    // return this.instituteService.create(createInstituteDto);
  }

  @MessagePattern('findAllInstitute')
  findAll() {
    return this.instituteService.findAll();
  }

  @MessagePattern('findOneInstitute')
  findOne(@Payload() id: number) {
    return this.instituteService.findOne(id);
  }

  @MessagePattern('updateInstitute')
  update(@Payload() updateInstituteDto: UpdateInstituteDto) {
    return this.instituteService.update(
      updateInstituteDto.id,
      updateInstituteDto,
    );
  }

  @MessagePattern('removeInstitute')
  remove(@Payload() id: number) {
    return this.instituteService.remove(id);
  }
}
