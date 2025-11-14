import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from './User';
import { InstituteModule } from './InstituteModule';
import { Incident } from './Incident';
import { IncidentFile } from './IncidentFile';
import { Camera } from './Camera';

export enum InstituteStatus {
  ACTIVE = '1',
  INACTIVE = '2',
  BLOCKED = '3',
  DELETED = '4',
}

@Entity('institutes')
export class Institute {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  img: string;

  @Column()
  address: string;

  @Column()
  ruc: string;

  @Column({
    type: 'enum',
    enum: InstituteStatus,
  })
  status: InstituteStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  @OneToMany(() => User, (user) => user.institute)
  users: User[];

  @OneToMany(() => InstituteModule, (im) => im.institute)
  instituteModules: InstituteModule[];

  @OneToMany(() => Incident, (incident) => incident.institute)
  incidents: Incident[];

  @OneToMany(() => IncidentFile, (file) => file.institute)
  incidentFiles: IncidentFile[];

  @OneToMany(() => Camera, (camera) => camera.institute) // 👈 RELACIÓN AGREGADA
  cameras: Camera[];
}
