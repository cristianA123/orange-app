// src/entities/Department.ts
import { Entity, PrimaryColumn, Column } from 'typeorm';
// import { Province } from './Province';

@Entity('departments') // ← Mismo nombre de tabla
export class Department {
  [x: string]: any;
  @PrimaryColumn({ type: 'char', length: 2 }) // ← depID char(2)
  depID: string;

  @Column({ type: 'varchar', length: 150, nullable: true }) // ← depNombre varchar(150) null
  depNombre: string;
}
