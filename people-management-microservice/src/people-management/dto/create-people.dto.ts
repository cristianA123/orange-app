// src/people/dto/create-people.dto.ts
export class CreatePeopleDto {
  // Campos principales requeridos
  paternalSurname: string;
  maternalSurname: string;
  names: string;

  // Información de contacto
  cellphone?: string;
  email?: string;
  address?: string;
  landline?: string;

  // Documentación e información personal
  documentType?: string;
  document?: string;
  gender?: string;
  birthDate?: Date;
  age?: number;
  domicile?: string;

  // Información de salud y características
  healthInsurance?: boolean;
  insuranceType?: string;
  sctr?: boolean;
  isDonor?: boolean;
  tattoos?: boolean;
  militaryService?: boolean;
  weaponsLicense?: boolean;
  differentAbility?: boolean;
  height?: number;
  weight?: number;
  childrenNumber?: number;
  // Información familiar
  spouse?: string;

  // Contacto de emergencia
  emergencyName?: string;
  emergencyEmail?: string;
  emergencyPhone?: string;

  // IDs de relaciones (opcionales)
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

  // Arrays de licencias
  licensesAIds?: string[];
  licensesBIds?: string[];

  // Campos de auditoría (si los necesitas)
  lastUserModified?: string;
}
