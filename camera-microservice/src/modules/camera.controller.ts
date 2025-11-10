import { Controller } from '@nestjs/common';
import { CameraService } from './camera.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class CameraMicroserviceController {
  constructor(private readonly cameraService: CameraService) {}

  @MessagePattern({ cmd: 'GET_HEAT_MAP' })
  async getUserModules(@Payload() data: { instituteId: string }) {
    return this.cameraService.getHeatMapByCamera(data.instituteId);
  }
}
