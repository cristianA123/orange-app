import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Institute } from './Institute';
import { Module } from './Module';

@Entity('institute_modules')
export class InstituteModule {
  @PrimaryColumn('uuid')
  id: string;

  @ManyToOne(() => Institute, (institute) => institute.instituteModules)
  @JoinColumn({ name: 'institute_id' })
  institute: Institute;

  @ManyToOne(() => Module, (module) => module.instituteModules)
  @JoinColumn({ name: 'module_id' })
  module: Module;
}
