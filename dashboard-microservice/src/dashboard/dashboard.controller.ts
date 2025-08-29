import { Controller } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class DashboardController {
    constructor(private readonly moduleService: DashboardService) {}
}
