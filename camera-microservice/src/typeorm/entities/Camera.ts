import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn
} from 'typeorm';
import { Institute } from './Institute';
import { Incident } from './Incident';

export enum CameraStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE',
  DISCONNECTED = 'DISCONNECTED',
}

@Entity('cameras')
export class Camera {
  @PrimaryColumn('char', { length: 36 })
  id: string;

  @Column()
  camera_number: string;

  @Column('decimal', { precision: 10, scale: 6 })
  latitude: number;

  @Column('decimal', { precision: 10, scale: 6 })
  longitude: number;

  @Column()
  address: string;

  @Column({
    type: 'enum',
    enum: CameraStatus,
  })
  status: CameraStatus;

  @ManyToOne(() => Institute, (institute) => institute.cameras, { nullable: true })
  @JoinColumn({ name: 'institute_id' })
  institute: Institute;

  @Column({ nullable: true })
  institute_id: string;

  @OneToMany(() => Incident, (incident) => incident.camera)
  incidents: Incident[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
