import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
} from 'typeorm';
import { UserModule } from './UserModule';
import { Incident } from './Incident';
import { Institute } from './Institute';

export enum UserStatus {
  ACTIVE = '1',
  INACTIVE = '2',
  PENDING = '3',
  SUSPENDED = '4',
  DELETED = '5',
}

export enum UserRole {
  SUPERADMIN = 'SUPERADMIN',
  USER = 'USER',
  EMPLOYEE = 'EMPLOYEE',
}

@Entity('users')
export class User {
  @PrimaryColumn('uuid')
  id: string;

  @ManyToOne(() => Institute, (institute) => institute.users)
  @JoinColumn({ name: 'institute_id' })
  institute: Institute;

  @Column()
  institute_id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  documentType: string;

  @Column({ nullable: true })
  documentNumber: string;

  @Column({ nullable: true })
  jobLevel: string;

  @Column({ nullable: true })
  area: string;

  @Column({ nullable: true })
  areaGroup: string;

  @Column({ nullable: true })
  entryDate: Date;

  @Column({ nullable: true })
  contractType: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  identifier: string;

  @Column({ nullable: true })
  gender: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
  })
  status: UserStatus;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  rol: UserRole;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  @OneToMany(() => UserModule, (um) => um.user)
  userModules: UserModule[];

  @OneToMany(() => Incident, (incident) => incident.user)
  incidents: Incident[];
}
