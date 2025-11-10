import { ChildDto } from './child.dto';

export interface CreatePeopleDto {
  // Datos personales
  paternalSurname: string;
  maternalSurname: string;
  names: string;

  // Contacto
  cellphone?: string;
  email?: string;
  address?: string;
  landline?: string;

  // Documento e información personal
  documentType?: string;
  document?: string;
  gender?: string;
  birthDate?: Date;
  age?: number;
  domicile?: string;

  // Salud y características
  healthInsurance?: boolean;
  insuranceType?: string;
  sctr?: boolean;
  isDonor?: boolean;
  tattoos?: boolean;
  militaryService?: boolean;
  weaponsLicense?: boolean;
  differentAbility?: boolean;
  conadis?: boolean;
  rpas?: boolean;
  height?: number;
  weight?: number;
  childrenNumber?: number;

  // Información familiar
  spouse?: string;
  parentName?: string;
  motherName?: string;
  spouseName?: string;

  // Contacto de emergencia
  emergencyName?: string;
  emergencyEmail?: string;
  emergencyPhone?: string;
  relationshipType?: string;
  documentContact?: string;
  contactName?: string;
  contactPhone?: string;

  // Datos laborales / administrativos
  area?: string;
  jobTitle?: string;
  anexo?: string;

  // Relaciones (IDs)
  ubigeoId?: string;
  nationalityId?: string;
  departmentId?: string;
  provinceId?: string;
  districtId?: string;
  birthplaceDepartmentId?: string;
  maritalStatusId?: string;
  pensionSystemId?: string;
  bloodTypeId?: string;
  emergencyContactTypeId?: string;
  originId?: string;
  educationLevelId?: string;
  instituteId?: string;

  // Licencias
  licensesAIds?: string[];
  licensesBIds?: string[];

  // Auditoría
  lastUserModified?: string;
  createdAt?: Date;
  updatedAt?: Date;

  // Relación hijos
  children?: ChildDto[];

  // Relación cargo
  cargoId?: string;
}
