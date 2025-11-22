import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { People } from './People';
import { ContractType } from './ContractType';
import { Area } from './Area';
import { Cargo } from './Cargo';
import { ContractFile } from './ContractFile';

@Entity('contracts')
export class Contract {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => People, (people) => people.contracts)
  @JoinColumn({ name: 'people_id' })
  people: People;

  @ManyToOne(() => ContractType, (contractType) => contractType.contracts)
  @JoinColumn({ name: 'contract_type_id' })
  contractType: ContractType;

  @ManyToOne(() => Area, (area) => area.contracts)
  @JoinColumn({ name: 'area_id' })
  area: Area;

  @ManyToOne(() => Cargo, (cargo) => cargo.contracts)
  @JoinColumn({ name: 'cargo_id' })
  cargo: Cargo;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  // Tiempo trabajado can be calculated, but if they want to store it explicitly:
  @Column({ nullable: true })
  workedTime: string;

  @Column({ nullable: true })
  reasonForTermination: string;

  @OneToMany(() => ContractFile, (contractFile) => contractFile.contract, {
    cascade: true,
  })
  files: ContractFile[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
