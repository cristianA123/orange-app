import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Module } from './Module';

@Entity('user_modules')
export class UserModule {
  @PrimaryColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.userModules)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Module, (module) => module.userModules)
  @JoinColumn({ name: 'module_id' })
  module: Module;
}
