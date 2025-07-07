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

@Entity('incidents')
export class Incident {
  @PrimaryColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.incidents)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Institute, (institute) => institute.incidents)
  @JoinColumn({ name: 'institute_id' })
  institute: Institute;

  @Column()
  type: string;

  @Column()
  subtype: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  address: string;

  @Column('decimal', { precision: 10, scale: 6 })
  location_lat: number;

  @Column('decimal', { precision: 10, scale: 6 })
  location_lng: number;

  @Column()
  source: string;

  @Column({ nullable: true })
  officer_name?: string;

  @Column({ nullable: true })
  phone_number?: string;

  @Column({ nullable: true })
  sender_name?: string;

  @Column({ nullable: true })
  camera_number?: string;

  @Column({ nullable: true })
  document_number?: string;

  @Column({ type: 'timestamp', nullable: true })
  attention_date?: Date;

  @Column({ type: 'timestamp', nullable: true })
  closing_date?: Date;

  @Column()
  is_relevant: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  @OneToMany(() => IncidentFile, (file) => file.incident)
  incidentFiles: IncidentFile[];
}
