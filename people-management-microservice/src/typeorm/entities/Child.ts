// src/entities/Child.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { People } from './People';

@Entity('children')
export class Child {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'date', nullable: true })
  birthDate: Date;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  differentAbility: boolean;

  @Column({ nullable: true })
  conadis: boolean;

  @Column({ nullable: true })
  document: string;

  @Column({ nullable: true })
  age: number;

  //cumple años
  @Column({ nullable: true })
  birthday: Date;

  @ManyToOne(() => People, (people) => people.children, {
    onDelete: 'CASCADE', // si se elimina la persona, se eliminan sus hijos
  })
  @JoinColumn({ name: 'people_id' })
  parent: People;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
