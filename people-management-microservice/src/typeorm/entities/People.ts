// src/entities/People.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';

import { Department } from './Department';
import { Province } from './Province';
import { District } from './District';
import { Nationality } from './Nationality';
import { MaritalStatus } from './MaritalStatus';
import { Origin } from './Origin';
import { PensionSystem } from './PensionSystem';
import { LicenseA } from './LicenseA';
import { LicenseB } from './LicenseB';
import { EducationLevel } from './EducationLevel';
import { BloodType } from './BloodType';
import { EmergencyContactType } from './EmergencyContactType';
import { Optional } from '@nestjs/common';
import { Institute } from './Institute';
import { Child } from './Child';
import { Cargo } from './Cargo';
import { Incident } from './Incident';

@Entity('people')
export class People {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ubigeo
  @ManyToOne(() => District, { nullable: true })
  @JoinColumn({ name: 'ubigeo_id', referencedColumnName: 'disID' })
  @Optional()
  ubigeo: District;

  // Nacionalidad
  @ManyToOne(() => Nationality, { nullable: true })
  @JoinColumn({ name: 'nationality_id' })
  nationality: Nationality;

  // departamento
  @ManyToOne(() => Department, { nullable: true })
  @JoinColumn({ name: 'department_id', referencedColumnName: 'depID' })
  department: Department;

  // provincia
  @ManyToOne(() => Province, { nullable: true })
  @JoinColumn({ name: 'province_id', referencedColumnName: 'proID' })
  province: Province;

  // distrito
  @ManyToOne(() => District, { nullable: true })
  @JoinColumn({ name: 'district_id', referencedColumnName: 'disID' })
  district: District;

  //anexo
  @Column({ nullable: true })
  anexo: string;

  // direccion
  @Column({ nullable: true })
  address: string;

  //LUGAR DE NACIMIENTO
  // lugar de nacimiento (Departamento)
  @ManyToOne(() => Department, { nullable: true })
  @JoinColumn({
    name: 'birthplace_department_id',
    referencedColumnName: 'depID',
  })
  birthplaceDepartment: Department;

  // provincia
  @ManyToOne(() => Province, { nullable: true })
  @JoinColumn({
    name: 'birthplace_province_id',
    referencedColumnName: 'proID',
  })
  birthplaceProvince: Province;

  // distrito
  @ManyToOne(() => District, { nullable: true })
  @JoinColumn({
    name: 'birthplace_district_id',
    referencedColumnName: 'disID',
  })
  birthplaceDistrict: District;

  //anexo
  @Column({ nullable: true })
  birthplaceAnexo: string;

  // direccion
  @Column({ nullable: true })
  birthplaceAddress: string;

  //LUGAR DE RESIDENCIA
  // lugar de nacimiento (Departamento)
  @ManyToOne(() => Department, { nullable: true })
  @JoinColumn({
    name: 'residence_department_id',
    referencedColumnName: 'depID',
  })
  residenceDepartment: Department;

  // provincia
  @ManyToOne(() => Province, { nullable: true })
  @JoinColumn({
    name: 'residence_province_id',
    referencedColumnName: 'proID',
  })
  residenceProvince: Province;

  // distrito
  @ManyToOne(() => District, { nullable: true })
  @JoinColumn({
    name: 'residence_district_id',
    referencedColumnName: 'disID',
  })
  residenceDistrict: District;

  //anexo
  @Column({ nullable: true })
  residenceAnexo: string;

  // direccion
  @Column({ nullable: true })
  residenceAddress: string;

  // apellido paterno
  @Column()
  paternalSurname: string;

  // apellido materno
  @Column()
  maternalSurname: string;

  // nombres
  @Column()
  names: string;

  // celular
  @Column({ nullable: true })
  cellphone: string;

  // telefono fijo
  @Column({ nullable: true })
  landlinePhone: string;

  // email
  @Column({ nullable: true })
  email: string;

  // tipo de documento
  @Column({ nullable: true })
  documentType: string;

  // documento
  @Column({ nullable: true })
  document: string;

  // sexo
  @Column({ nullable: true })
  gender: string;

  // fecha de nacimiento
  @Column({ type: 'date', nullable: true })
  birthDate: Date;

  // edad
  @Column({ nullable: true })
  age: number;

  // estado civil
  @ManyToOne(() => MaritalStatus, { nullable: true })
  @JoinColumn({ name: 'marital_status_id' })
  maritalStatus: MaritalStatus;

  // sistema prevision
  @ManyToOne(() => PensionSystem, { nullable: true })
  @JoinColumn({ name: 'pension_system_id' })
  pensionSystem: PensionSystem;

  // seguro salud
  @Column({ nullable: true })
  healthInsurance: boolean;

  // tipo seguro
  @Column({ nullable: true })
  insuranceType: string;

  // SCTR
  @Column({ nullable: true })
  sctr: boolean;

  // es donante
  @Column({ nullable: true })
  isDonor: boolean;

  // grupo sanguineo
  @ManyToOne(() => BloodType, { nullable: true })
  @JoinColumn({ name: 'blood_type_id' })
  bloodType: BloodType;

  // conyuge
  @Column({ nullable: true })
  spouse: string;

  // tatuajes
  @Column({ nullable: true })
  tattoos: boolean;

  // servicio militar
  @Column({ nullable: true })
  militaryService: boolean;

  // licencia armas
  @Column({ nullable: true })
  weaponsLicense: boolean;

  // licencia rpas
  @Column({ nullable: true })
  rpas: boolean;

  // habilidad diferente
  @Column({ nullable: true })
  differentAbility: boolean;

  @Column({ nullable: true })
  conadis: boolean;

  // estatura
  @Column({ nullable: true })
  height: number;

  // peso
  @Column({ nullable: true })
  weight: number;

  // numero hijos
  @Column({ nullable: true })
  childrenNumber: number;

  // contacto emergencia
  @ManyToOne(() => EmergencyContactType, { nullable: true })
  @JoinColumn({ name: 'emergency_contact_type_id' })
  emergencyContactType: EmergencyContactType;

  // nombre emergencia
  @Column({ nullable: true })
  emergencyName: string;

  // correo emergencia
  @Column({ nullable: true })
  emergencyEmail: string;

  // telefono emergencia
  @Column({ nullable: true })
  emergencyPhone: string;

  // procedencia
  @ManyToOne(() => Origin, { nullable: true })
  @JoinColumn({ name: 'origin_id' })
  origin: Origin;

  // licencia A
  @ManyToMany(() => LicenseA)
  @JoinTable({
    name: 'people_licenses_a',
    joinColumn: { name: 'people_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'license_a_id', referencedColumnName: 'id' },
  })
  licensesA: LicenseA[];

  // licencia B
  @ManyToMany(() => LicenseB)
  @JoinTable({
    name: 'people_licenses_b',
    joinColumn: { name: 'people_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'license_b_id', referencedColumnName: 'id' },
  })
  licensesB: LicenseB[];

  // nivel estudios
  @ManyToOne(() => EducationLevel, { nullable: true })
  @JoinColumn({ name: 'education_level_id' })
  educationLevel: EducationLevel;

  // ultima fecha modificacion
  @Column({ type: 'timestamp', nullable: true })
  lastModificationDate: Date;

  // ultimo usuario que modifico
  @Column({ nullable: true })
  lastUserModified: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => Institute, { nullable: true })
  @JoinColumn({ name: 'institution_id' })
  institution: Institute;

  //DATOS FAMILIARES
  @OneToMany(() => Child, (child) => child.parent, { cascade: true })
  children: Child[];

  // Nombre del padre
  @Column({ nullable: true })
  parentName: string;

  // Nombre de la Madre
  @Column({ nullable: true })
  motherName: string;

  // Nombre del conyuge
  @Column({ nullable: true })
  spouseName: string;

  // DATOS DE CONTACTO
  //tipo de parentesco
  @Column({ nullable: true })
  relationshipType: string;
  // dni
  @Column({ nullable: true })
  documentContact: string;
  // nombre del contacto
  @Column({ nullable: true })
  contactName: string;

  // telefono del contacto
  @Column({ nullable: true })
  contactPhone: string;

  //OTROS DATOS
  // Area
  @Column({ nullable: true })
  area: string;

  // Cargo
  @Column({ nullable: true })
  jobTitle: string;

  @ManyToOne(() => Cargo, (cargo) => cargo.people)
  @JoinColumn({ name: 'cargo_id' })
  cargo: Cargo;

  // Incidentes
  @OneToMany(() => Incident, (incident) => incident.people)
  incidents: Incident[];
}
