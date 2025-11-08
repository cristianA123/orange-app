import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreatePeopleDto } from './dto/create-people.dto';
import { PeopleManagementService } from './people-management.service';
import { UpdatePeopleDto } from './dto/update-people.dto';

@Controller()
export class PeopleManagementController {
  constructor(
    private readonly peopleManagementService: PeopleManagementService,
  ) {}

  @MessagePattern({ cmd: 'CREATE_PEOPLE' })
  async create(@Payload() createPeopleDto: CreatePeopleDto) {
    console.log('e2');
    return this.peopleManagementService.create(createPeopleDto);
  }

  @MessagePattern({ cmd: 'UPDATE_PEOPLE' })
  async update(@Payload() updatePeopleDto: UpdatePeopleDto) {
    console.log('e2');
    return this.peopleManagementService.update(
      updatePeopleDto.id,
      updatePeopleDto,
    );
  }

  @MessagePattern({ cmd: 'GET_PEOPLE' })
  findAllPeople(@Payload() instituteId: string) {
    return this.peopleManagementService.findAllPeopleByInstituteId(instituteId);
  }

  @MessagePattern({ cmd: 'GET_PEOPLE_BY_ID' })
  getPeopleById(@Payload() id: string) {
    return this.peopleManagementService.getPeopleById(id);
  }

  @MessagePattern({ cmd: 'GET_PEOPLE_FORM_DATA' })
  getPeopleFormData() {
    return this.peopleManagementService.getPeopleFormData();
  }

  @MessagePattern({ cmd: 'GET_PROVINCES_BY_DEPARTMENT' })
  getProvincesByDepartment(@Payload() departmentId: string) {
    return this.peopleManagementService.getProvincesByDepartment(departmentId);
  }

  @MessagePattern({ cmd: 'GET_DISTRICTS_BY_PROVINCE' })
  getDistrictsByProvince(@Payload() provinceId: string) {
    return this.peopleManagementService.getDistrictsByProvince(provinceId);
  }

  // @MessagePattern({ cmd: 'DELETE_INCIDENT2' })
  // remove(@Payload() id: string) {
  //   return this.peopleManagementService.remove(id);
  // }
}
