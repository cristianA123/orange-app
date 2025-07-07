import { Controller, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common';
import { ClientProxy, Payload } from '@nestjs/microservices';
import { CreateInstituteDto } from './dtos/create-institute.dto';
// import { UpdateInstituteDto } from './dtos/update-institute.dto';
import { handleRpcError } from 'src/common/erros/error-handler';
import { lastValueFrom } from 'rxjs';

@Controller('institute')
export class InstituteController {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}

  // const response = await lastValueFrom(
  //   this.natsClient.send({ cmd: 'createUser' }, createUserDto),
  // );

  @Post('/')
  @HttpCode(HttpStatus.OK)
  async create(@Payload() createInstituteDto: CreateInstituteDto) {
    try {
      // return { hola: 1, createInstituteDto };
      const response = await lastValueFrom(
        this.natsClient.send({ cmd: 'CREATE_INSTITUTE' }, createInstituteDto),
      );

      return response;
    } catch (error) {
      console.error(error);
      handleRpcError(error);
    }
  }

  // @MessagePattern('findAllInstitute')
  // findAll() {
  //   return this.instituteService.findAll();
  // }

  // @MessagePattern('findOneInstitute')
  // findOne(@Payload() id: number) {
  //   return this.instituteService.findOne(id);
  // }

  // @MessagePattern('updateInstitute')
  // update(@Payload() updateInstituteDto: UpdateInstituteDto) {
  //   return this.instituteService.update(
  //     updateInstituteDto.id,
  //     updateInstituteDto,
  //   );
  // }

  // @MessagePattern('removeInstitute')
  // remove(@Payload() id: number) {
  //   return this.instituteService.remove(id);
  // }
}
