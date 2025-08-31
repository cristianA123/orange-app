import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Inject,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ClientProxy, Payload } from '@nestjs/microservices';
import { handleRpcError } from 'src/common/erros/error-handler';
import { lastValueFrom } from 'rxjs';
import {NatsAuthGuard} from "../auth/guards/auth.guards";
import {RequestWithUser} from "../modules/interfaces/request-with-user.interface";
import { successResponse } from 'src/common/response/response.util';

@Controller('dashboard')
export class DashboardController {
    constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}

    @UseGuards(NatsAuthGuard)
    @Get('/incidents')
    @HttpCode(HttpStatus.OK)
    async getIncidents(@Req() req: RequestWithUser) {
        const instituteId = req.user.instituteId;
        try {
            const response = await lastValueFrom(
                this.natsClient.send({ cmd: 'GET_DASHBOARD_INCIDENTS' }, { instituteId }),
            );

            return successResponse(response);
        } catch (error) {
            console.error(error);
            handleRpcError(error);
        }
    }

    @UseGuards(NatsAuthGuard)
    @Get('/kpis')
    @HttpCode(HttpStatus.OK)
    async getKpis(@Req() req: RequestWithUser) {
        const instituteId = req.user.instituteId;
        try {
            const response = await lastValueFrom(
                this.natsClient.send({ cmd: 'GET_DASHBOARD_KPIS' }, { instituteId }),
            );

            return successResponse(response);
        } catch (error) {
            console.error(error);
            handleRpcError(error);
        }
    }

    @UseGuards(NatsAuthGuard)
    @Get('/top')
    @HttpCode(HttpStatus.OK)
    async getBettersWorks(@Req() req: RequestWithUser) {
        const instituteId = req.user.instituteId;
        try {
            const response = await lastValueFrom(
                this.natsClient.send({ cmd: 'GET_DASHBOARD_TOP' }, { instituteId }),
            );

            return successResponse(response);
        } catch (error) {
            console.error(error);
            handleRpcError(error);
        }
    }

    @UseGuards(NatsAuthGuard)
    @Get('/work')
    @HttpCode(HttpStatus.OK)
    async getBetterWorks(@Req() req: RequestWithUser) {
        const instituteId = req.user.instituteId;
        try {
            const response = await lastValueFrom(
                this.natsClient.send({ cmd: 'GET_DASHBOARD_WORK' }, { instituteId }),
            );

            return successResponse(response);
        } catch (error) {
            console.error(error);
            handleRpcError(error);
        }
    }
}
