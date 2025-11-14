import { Controller } from '@nestjs/common';
import { CameraService } from './camera.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class CameraMicroserviceController {
  constructor(private readonly cameraService: CameraService) {}

  @MessagePattern({ cmd: 'GET_HEAT_MAP' })
  async getHeatMap(
      @Payload()
      data: { instituteId: string; from?: string; to?: string }
  ) {
    return this.cameraService.getHeatMapByCamera(
        data.instituteId,
        data.from,
        data.to
    );
  }
}
