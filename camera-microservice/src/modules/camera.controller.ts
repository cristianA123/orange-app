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

  @MessagePattern({ cmd: 'GET_INCIDENTS' })
  async getIncidents(
      @Payload() data: { instituteId: string; from?: string; to?: string }
  ) {
    return this.cameraService.getIncidents(
        data.instituteId,
        data.from,
        data.to,
    );
  }

  @MessagePattern({ cmd: 'GET_CAMERAS_BY_INSTITUTE' })
  async getCameras(
      @Payload() data: { instituteId: string }
  ) {
    return await this.cameraService.getCamerasByInstituteId(
        data.instituteId
    );
  }
}
