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
}
