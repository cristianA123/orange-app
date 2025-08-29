import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Incident } from '../typeorm/entities/Incident';
import { RpcException } from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(Incident)
        private readonly userModulesRepo: Repository<Incident>
    ) {}
}
