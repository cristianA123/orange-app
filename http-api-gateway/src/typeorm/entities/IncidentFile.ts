import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Incident } from './Incident';
import { Institute } from './Institute';

export enum FileType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT',
  OTHER = 'OTHER',
}

@Entity('incident_files')
export class IncidentFile {
  @PrimaryColumn('uuid')
  id: string;

  @ManyToOne(() => Incident, (incident) => incident.incidentFiles)
  @JoinColumn({ name: 'incident_id' })
  incident: Incident;

  @ManyToOne(() => Institute, (institute) => institute.incidentFiles)
  @JoinColumn({ name: 'institute_id' })
  institute: Institute;

  @Column()
  url: string;

  @Column()
  fileName: string;

  @Column({
    type: 'enum',
    enum: FileType,
  })
  file_type: FileType;

  @Column()
  mime_type: string;

  @Column('bigint')
  size: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
