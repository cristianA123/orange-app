// cargo.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { People } from './People';
import { Contract } from './Contract';
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

  @OneToMany(() => Contract, (contract) => contract.cargo)
  contracts: Contract[];
}
