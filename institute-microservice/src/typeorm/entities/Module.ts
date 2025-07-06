import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { InstituteModule } from './InstituteModule';
import { UserModule } from './UserModule';

@Entity('modules')
export class Module {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  path: string;

  @Column()
  slog: string;

  @Column({ name: 'is_main_module' })
  isMainModule: boolean;

  @ManyToOne(() => Module, (module) => module.children, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent?: Module;

  @OneToMany(() => Module, (module) => module.parent)
  children: Module[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  @OneToMany(() => InstituteModule, (im) => im.module)
  instituteModules: InstituteModule[];

  @OneToMany(() => UserModule, (um) => um.module)
  userModules: UserModule[];
}
