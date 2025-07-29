import { Controller } from '@nestjs/common';
import { ModuleService } from './module.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class ModuleMicroserviceController {
  constructor(private readonly moduleService: ModuleService) {}

  @MessagePattern({ cmd: 'GET_USER_MODULES' })
  async getUserModules(@Payload() data: { userId: string }) {
    return this.moduleService.getUserModules(data.userId);
  }

  @MessagePattern({ cmd: 'SYNC_USER_MODULES' })
  async syncUserModules(
    @Payload() data: { userId: string; modulesIds: string[] },
  ) {
    return this.moduleService.syncUserModules(data.userId, data.modulesIds);
  }

  @MessagePattern({ cmd: 'SYNC_INSTITUTE_MODULES' })
  async syncInstituteModules(
    @Payload() data: { instituteId: string; modulesIds: string[] },
  ) {
    return this.moduleService.syncInstituteModules(
      data.instituteId,
      data.modulesIds,
    );
  }

  @MessagePattern({ cmd: 'GET_MODULES' })
  async getModules() {
    return this.moduleService.getModules();
  }

  @MessagePattern({ cmd: 'GET_MODULES_BY_USER' })
  async getModulesByUserId(@Payload() userId: string) {
    return this.moduleService.getModulesByUserId(userId);
  }

  @MessagePattern({ cmd: 'GET_MODULES_BY_INSTITUTE' })
  async getModulesByInstituteId(@Payload() instituteId: string) {
    return this.moduleService.getModulesByInstituteId(instituteId);
  }
}
