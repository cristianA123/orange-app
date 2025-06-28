import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'payments' })
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('float')
  amount: number;
}
