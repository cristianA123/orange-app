// src/entities/Province.ts
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Department } from './Department';
// import { Department } from './Department';

@Entity('provinces') // ← Mismo nombre de tabla
export class Province {
  [x: string]: any;
  @PrimaryColumn({ type: 'char', length: 4 }) // ← proID char(4)
  proID: string;

  @Column({ type: 'char', length: 2, nullable: true }) // ← proDep char(2) null
  proDep: string;

  @Column({ type: 'varchar', length: 150, nullable: true }) // ← proNombre varchar(150) null
  proNombre: string;

  // Relación opcional - si quieres mantenerla en TypeORM
  @ManyToOne(() => Department, (department) => department.provincias)
  @JoinColumn({ name: 'proDep', referencedColumnName: 'depID' })
  departamento: Department;
}
