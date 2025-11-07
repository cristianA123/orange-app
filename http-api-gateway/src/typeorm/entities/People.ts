// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   CreateDateColumn,
//   UpdateDateColumn,
//   DeleteDateColumn,
//   ManyToOne,
//   JoinColumn,
// } from 'typeorm';
// import { Incident } from './Incident';

// @Entity('people')
// export class People {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   // ubigeo
//   @Column()
//   ubigeo: string;

//   // Nacionalidad
//   @Column()
//   nationality: string;

//   // departamento
//   @Column()
//   department: string;

//   // provincia
//   @Column()
//   province: string;

//   // distrito
//   @Column()
//   district: string;

//   // apellido paterno
//   @Column()
//   paternalSurname: string;

//   // apellido materno
//   @Column()
//   maternalSurname: string;

//   // nombres
//   @Column()
//   names: string;

//   // celular
//   @Column({ nullable: true })
//   cellphone: string;

//   // email
//   @Column({ nullable: true })
//   email: string;

//   // direccion
//   @Column({ nullable: true })
//   address: string;

//   // tipo de documento
//   @Column({ nullable: true })
//   documentType: string;

//   // documento
//   @Column({ nullable: true })
//   document: string;

//   // sexo
//   @Column({ nullable: true })
//   gender: string;

//   // fecha de nacimiento
//   @Column({ type: 'date', nullable: true })
//   birthDate: Date;

//   // edad
//   @Column({ nullable: true })
//   age: number;

//   // lugar de nacimiento
//   @Column({ nullable: true })
//   birthplace: string;

//   // lugar de domicilio
//   @Column({ nullable: true })
//   domicile: string;

//   // telefono fijo
//   @Column({ nullable: true })
//   landline: string;

//   // estado civil
//   @Column({ nullable: true })
//   maritalStatus: string;

//   // sistema prevision
//   @Column({ nullable: true })
//   pensionSystem: string;

//   // seguro salud
//   @Column({ nullable: true })
//   healthInsurance: string;

//   // tipo seguro
//   @Column({ nullable: true })
//   insuranceType: string;

//   // SCTR
//   @Column({ nullable: true })
//   sctr: string;

//   // es donante
//   @Column({ nullable: true })
//   isDonor: string;

//   // grupo sanguineo
//   @Column({ nullable: true })
//   bloodType: string;

//   // conyuge
//   @Column({ nullable: true })
//   spouse: string;

//   // tatuajes
//   @Column({ nullable: true })
//   tattoos: string;

//   // servicio militar
//   @Column({ nullable: true })
//   militaryService: string;

//   // licencia armas
//   @Column({ nullable: true })
//   weaponsLicense: string;

//   // habilidad diferente
//   @Column({ nullable: true })
//   differentAbility: string;

//   // estatura
//   @Column({ nullable: true })
//   height: number;

//   // peso
//   @Column({ nullable: true })
//   weight: number;

//   // numero hijos
//   @Column({ nullable: true })
//   childrenNumber: number;

//   // contacto emergencia
//   @Column({ nullable: true })
//   emergencyContact: string;

//   // nombre emergencia
//   @Column({ nullable: true })
//   emergencyName: string;

//   // correo emergencia
//   @Column({ nullable: true })
//   emergencyEmail: string;

//   // telefono emergencia
//   @Column({ nullable: true })
//   emergencyPhone: string;

//   // procedencia
//   @Column({ nullable: true })
//   origin: string;

//   // licencia A
//   @Column({ nullable: true })
//   licenseA: string;

//   // licencia B
//   @Column({ nullable: true })
//   licenseB: string;

//   // nivel estudios
//   @Column({ nullable: true })
//   educationLevel: string;

//   // ultima fecha modificacion
//   @Column({ type: 'timestamp', nullable: true })
//   lastModificationDate: Date;

//   // ultimo usuario que modifico
//   @Column({ nullable: true })
//   lastUserModified: string;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;

//   @DeleteDateColumn()
//   deletedAt?: Date;

//   @ManyToOne(() => Incident, (incident) => incident.incidentFiles)
//   @JoinColumn({ name: 'incident_id' })
//   incident: Incident;
// }
