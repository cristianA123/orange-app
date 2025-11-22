import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreatePeopleDto } from './dto/create-people.dto';
import { PeopleManagementService } from './people-management.service';
import { UpdatePeopleDto } from './dto/update-people.dto';
import { ContractService } from './contract.service';
import { S3Service } from './s3.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { TerminateContractDto } from './dto/terminate-contract.dto';

@Controller()
export class PeopleManagementController {
  constructor(
    private readonly peopleManagementService: PeopleManagementService,
    private readonly contractService: ContractService,
    private readonly s3Service: S3Service,
  ) { }

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

  @MessagePattern({ cmd: 'GET_PEOPLE_SUMMARY' })
  findAllPeopleByInstituteIdToSummary(
    @Payload() payload: { instituteId: string; source: string },
  ) {
    return this.peopleManagementService.findAllPeopleByInstituteIdToSummary(
      payload.instituteId,
      payload.source,
    );
  }

  @MessagePattern({ cmd: 'GET_PEOPLE_SECURITY' })
  findAllPeopleSecurityByInstituteId(
    @Payload() payload: { instituteId: string; source: string },
  ) {
    return this.peopleManagementService.findAllPeopleSecurityByInstituteId(
      payload.instituteId,
    );
  }

  @MessagePattern({ cmd: 'DELETE_PEOPLE' })
  remove(@Payload() id: string) {
    return this.peopleManagementService.remove(id);
  }

  @MessagePattern({ cmd: 'CREATE_CONTRACT' })
  createContract(@Payload() createContractDto: CreateContractDto) {
    return this.contractService.create(createContractDto);
  }

  @MessagePattern({ cmd: 'TERMINATE_CONTRACT' })
  terminateContract(@Payload() terminateContractDto: TerminateContractDto) {
    return this.contractService.terminate(terminateContractDto);
  }

  @MessagePattern({ cmd: 'REENTRY_CONTRACT' })
  async reentryContract(@Payload() createContractDto: CreateContractDto) {
    return await this.contractService.reentry(createContractDto);
  }

  @MessagePattern({ cmd: 'UPLOAD_CONTRACT_FILE' })
  async uploadContractFile(@Payload() payload: any) {
    return await this.s3Service.uploadFile(payload);
  }

  @MessagePattern({ cmd: 'GENERATE_PRESIGNED_URL_CONTRACT' })
  async generatePresignedUrlContract(@Payload() payload: any) {
    return await this.s3Service.generatePresignedUrl(payload);
  }

  @MessagePattern({ cmd: 'CONFIRM_UPLOAD_CONTRACT' })
  async confirmUploadContract(@Payload() payload: any) {
    return await this.s3Service.confirmUpload(payload);
  }
}
