import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IncidentRepository } from './incident.repository';
import { Incident } from 'src/typeorm/entities';

@Injectable()
export class IncidentImp implements IncidentRepository {
  constructor(
    @Inject(getRepositoryToken(Incident)) // Inyecta correctamente
    private readonly repo: Repository<Incident>,
  ) {}

  async create(data: Partial<Incident>): Promise<Incident> {
    const incident = this.repo.create(data);
    return this.repo.save(incident);
  }

  async findById(id: string): Promise<Incident | null> {
    return this.repo.findOneBy({ id });
  }

  async update(id: string, data: Partial<Incident>): Promise<void> {
    await this.repo.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
