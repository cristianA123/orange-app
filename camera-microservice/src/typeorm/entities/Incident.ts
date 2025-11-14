import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from './User';
import { Institute } from './Institute';
import { IncidentFile } from './IncidentFile';
import { People } from './People';
import {Camera} from "./Camera";

export enum IncidentStatus {
  OPEN = '1', // Abierto
  IN_PROGRESS = '2', // En proceso
  ATTENDED = '3', // Atendido
  CLOSED = '4', // Cerrado
  CANCELED = '5', // Cancelado
  DELETED = '6', // Eliminado
}

@Entity('incidents')
export class Incident {
  @PrimaryColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.incidents)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => User, (user) => user.incidents, { nullable: true })
  @JoinColumn({ name: 'officer_id' })
  officer: User;

  @ManyToOne(() => Institute, (institute) => institute.incidents)
  @JoinColumn({ name: 'institute_id' })
  institute: Institute;

  @Column()
  type: string;

  @Column()
  subType: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  address: string;

  @Column('decimal', { precision: 10, scale: 6 })
  locationLat: number;

  @Column('decimal', { precision: 10, scale: 6 })
  locationLng: number;

  @Column()
  formType: string;

  @Column({ nullable: true })
  officerName?: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ nullable: true })
  senderName?: string;

  @Column({ nullable: true })
  cameraNumber?: string;

  @Column({ nullable: true })
  documentNumber?: string;

  @ManyToOne(() => Camera, camera => camera.incidents, { nullable: true })
  @JoinColumn({ name: 'camera_id' })
  camera: Camera;

  @Column({ nullable: true })
  camera_id: string;

  @Column({ type: 'timestamp', nullable: true })
  attentionDate?: Date;

  @Column({ type: 'timestamp', nullable: true })
  closingDate?: Date;

  @Column()
  isRelevant: boolean;

  @Column()
  status: IncidentStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  @OneToMany(() => IncidentFile, (file) => file.incident)
  incidentFiles: IncidentFile[];

  //agregar people
  @ManyToOne(() => People, (people) => people.incidents, { nullable: true })
  @JoinColumn({ name: 'people_id' })
  people: People;

  @Column({ nullable: true })
  peopleName?: string;
}
