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
    console.log({ hola: 1, createInstituteDto });
    return this.instituteService.create(createInstituteDto);
  }

  @MessagePattern({ cmd: 'GET_INSTITUTES' })
  findAll() {
    return this.instituteService.findAll();
  }

  @MessagePattern({ cmd: 'GET_INSTITUTE' })
  findOne(@Payload() id: string) {
    return this.instituteService.findOne(id);
  }

  @MessagePattern({ cmd: 'GET_INSTITUTE_USERS' })
  findUsersByInstituteId(@Payload() id: string) {
    return this.instituteService.findUsersByInstituteId(id);
  }

  @MessagePattern({ cmd: 'UPDATE_INSTITUTE' })
  update(@Payload() updateInstituteDto: UpdateInstituteDto) {
    return this.instituteService.update(
      updateInstituteDto.id,
      updateInstituteDto,
    );
  }

  @MessagePattern({ cmd: 'VALIDATE_INSTITUTE_BY_ID' })
  validateInstituteById(@Payload() id: string) {
    return this.instituteService.validateInstituteById(id);
  }
}
