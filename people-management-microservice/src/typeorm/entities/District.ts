// src/entities/District.ts
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Province } from './Province';

@Entity('districts') // ← Mismo nombre de tabla
export class District {
  @PrimaryColumn({ type: 'char', length: 6 }) // ← disID char(6)
  disID: string;

  @Column({ type: 'char', length: 2, nullable: true }) // ← disDep char(2) null
  disDep: string;

  @Column({ type: 'char', length: 4, nullable: true }) // ← disProv char(4) null
  disProv: string;

  @Column({ type: 'varchar', length: 150, nullable: true }) // ← disNombre varchar(150) null
  disNombre: string;

  // Relación opcional - si quieres mantenerla en TypeORM
  @ManyToOne(() => Province, (province) => province.distritos)
  @JoinColumn({ name: 'disProv', referencedColumnName: 'proID' })
  provincia: Province;
}
