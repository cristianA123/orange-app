import { Incident } from 'src/typeorm/entities';

export interface IncidentRepository {
  create(data: Partial<Incident>): Promise<Incident>; // Reemplaza `any` por tus entidades o DTOs
  findById(id: string): Promise<Incident | null>;
  update(id: string, data: Partial<Incident>): Promise<void>;
  delete(id: string): Promise<void>;
}
