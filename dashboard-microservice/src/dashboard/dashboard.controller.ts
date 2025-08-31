import { Controller } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    @MessagePattern({ cmd: 'GET_DASHBOARD_INCIDENTS' })
    async getIncidents(@Payload() data: { instituteId: string }) {
        return this.dashboardService.getIncidents(data.instituteId);
    }

    @MessagePattern({ cmd: 'GET_DASHBOARD_KPIS' })
    async getKpis(@Payload() data: { instituteId: string }) {
        return this.dashboardService.getKpis(data.instituteId);
    }

    @MessagePattern({ cmd: 'GET_DASHBOARD_TOP' })
    async getBettersWorks(@Payload() data: { instituteId: string }) {
        return this.dashboardService.getBettersWorks(data.instituteId);
    }

    @MessagePattern({ cmd: 'GET_DASHBOARD_WORK' })
    async getBetterWorks(@Payload() data: { instituteId: string }) {
        return this.dashboardService.getBetterWorks(data.instituteId);
    }
}
