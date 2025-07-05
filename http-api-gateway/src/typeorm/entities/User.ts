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
  // SUPERADMIN = 'SUPERADMIN',
  ADMIN = 'ADMIN',
  DISPATCHER = 'DISPATCHER',
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

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  identifier: string;

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
