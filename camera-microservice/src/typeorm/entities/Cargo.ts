// cargo.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { People } from './People';
// import { People } from '../../people/entities/people.entity';

@Entity('cargos')
export class Cargo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  source: string; // Ej: CAMPO, VIDEOVIGILANCIA, ORDEN DIRECTA, etc.

  @OneToMany(() => People, (people) => people.cargo)
  people: People[];
}
