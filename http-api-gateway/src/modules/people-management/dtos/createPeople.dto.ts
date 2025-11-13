import { Type } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsDateString,
  IsNumber,
  IsBoolean,
  IsUUID,
  IsArray,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { ChildDto } from './child.dto';
// import { Type } from 'class-transformer';
// import { ApiProperty } from '@nestjs/swagger';

export class CreatePeopleDto {
  // @ApiProperty({ description: 'Apellido paterno' })
  @IsString()
  paternalSurname: string;

  // @ApiProperty({ description: 'Apellido materno' })
  @IsString()
  maternalSurname: string;

  // @ApiProperty({ description: 'Nombres' })
  @IsString()
  names: string;

  // @ApiProperty({ description: 'Celular', required: false })
  @IsOptional()
  @IsString()
  cellphone?: string;

  // @ApiProperty({ description: 'Email', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  // @ApiProperty({ description: 'Dirección', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  // @ApiProperty({ description: 'Tipo de documento', required: false })
  @IsOptional()
  @IsString()
  documentType?: string;

  // @ApiProperty({ description: 'Número de documento', required: false })
  @IsOptional()
  @IsString()
  document?: string;

  // @ApiProperty({ description: 'Sexo', required: false })
  @IsOptional()
  @IsString()
  gender?: string;

  // @ApiProperty({
  //   description: 'Fecha de nacimiento (YYYY-MM-DD)',
  //   required: false,
  // })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  // @ApiProperty({ description: 'Edad', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(150)
  age?: number;

  // @ApiProperty({ description: 'Lugar de domicilio', required: false })
  @IsOptional()
  @IsString()
  domicile?: string;

  // @ApiProperty({ description: 'Teléfono fijo', required: false })
  @IsOptional()
  @IsString()
  landlinePhone?: string;

  // @ApiProperty({ description: 'Seguro de salud', required: false })
  @IsOptional()
  @IsBoolean()
  healthInsurance?: boolean;

  // @ApiProperty({ description: 'Tipo de seguro', required: false })
  @IsOptional()
  @IsString()
  insuranceType?: string;

  // @ApiProperty({ description: 'SCTR', required: false })
  @IsOptional()
  @IsBoolean()
  sctr?: boolean;

  // @ApiProperty({ description: 'Es donante', required: false })
  @IsOptional()
  @IsBoolean()
  isDonor?: boolean;

  // @ApiProperty({ description: 'Cónyuge', required: false })
  @IsOptional()
  @IsString()
  spouse?: string;

  // @ApiProperty({ description: 'Tatuajes', required: false })
  @IsOptional()
  @IsBoolean()
  tattoos?: boolean;

  // @ApiProperty({ description: 'Servicio militar', required: false })
  @IsOptional()
  @IsBoolean()
  militaryService?: boolean;

  // @ApiProperty({ description: 'Licencia de armas', required: false })
  @IsOptional()
  @IsBoolean()
  weaponsLicense?: boolean;

  // @ApiProperty({ description: 'Habilidad diferente', required: false })
  @IsOptional()
  @IsBoolean()
  differentAbility?: boolean;

  // @ApiProperty({ description: 'Estatura (cm)', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(300)
  height?: number;

  // @ApiProperty({ description: 'Peso (kg)', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(500)
  weight?: number;

  // @ApiProperty({ description: 'Número de hijos', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  childrenNumber?: number;

  // @ApiProperty({
  //   description: 'Nombre de contacto de emergencia',
  //   required: false,
  // })
  @IsOptional()
  @IsString()
  emergencyName?: string;

  // @ApiProperty({
  //   description: 'Email de contacto de emergencia',
  //   required: false,
  // })
  @IsOptional()
  @IsEmail()
  emergencyEmail?: string;

  // @ApiProperty({
  //   description: 'Teléfono de contacto de emergencia',
  //   required: false,
  // })
  @IsOptional()
  @IsString()
  emergencyPhone?: string;

  // Relaciones (IDs)
  // @ApiProperty({ description: 'ID del ubigeo', required: false })
  @IsOptional()
  // @IsUUID()
  ubigeoId?: string;

  // @ApiProperty({ description: 'ID de nacionalidad', required: false })
  @IsOptional()
  @IsUUID()
  nationalityId?: string;

  // @ApiProperty({ description: 'ID del departamento', required: false })
  @IsOptional()
  departmentId?: string;

  // @ApiProperty({ description: 'ID de la provincia', required: false })
  @IsOptional()
  provinceId?: string;

  // @ApiProperty({ description: 'ID del distrito', required: false })
  @IsOptional()
  districtId?: string;

  @IsOptional()
  birthplaceDepartmentId?: string;

  @IsOptional()
  birthplaceProvinceId?: string;

  @IsOptional()
  birthplaceDistrictId?: string;

  @IsOptional()
  birthplaceAnexo?: string;

  @IsOptional()
  birthplaceAddress?: string;

  @IsOptional()
  residenceDepartmentId?: string;

  @IsOptional()
  residenceProvinceId?: string;

  @IsOptional()
  residenceDistrictId?: string;

  @IsOptional()
  residenceAnexo?: string;

  @IsOptional()
  residenceAddress?: string;

  // @ApiProperty({ description: 'ID del estado civil', required: false })
  @IsOptional()
  @IsUUID()
  maritalStatusId?: string;

  // @ApiProperty({ description: 'ID del sistema de pensiones', required: false })
  @IsOptional()
  @IsUUID()
  pensionSystemId?: string;

  // @ApiProperty({ description: 'ID del tipo sanguíneo', required: false })
  @IsOptional()
  @IsUUID()
  bloodTypeId?: string;

  // @ApiProperty({
  //   description: 'ID del tipo de contacto de emergencia',
  //   required: false,
  // })
  @IsOptional()
  @IsUUID()
  emergencyContactTypeId?: string;

  // @ApiProperty({ description: 'ID de procedencia', required: false })
  @IsOptional()
  @IsUUID()
  originId?: string;

  // @ApiProperty({ description: 'ID del nivel de educación', required: false })
  @IsOptional()
  @IsUUID()
  educationLevelId?: string;

  // @ApiProperty({
  //   description: 'IDs de licencias A',
  //   required: false,
  //   type: [String],
  // })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  licensesAIds?: string[];

  // @ApiProperty({
  //   description: 'IDs de licencias B',
  //   required: false,
  //   type: [String],
  // })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  licensesBIds?: string[];

  @IsOptional()
  @IsBoolean()
  rpas?: boolean;

  @IsOptional()
  @IsBoolean()
  conadis?: boolean;

  @IsOptional()
  @IsString()
  anexo?: string;

  // @IsOptional()
  // @IsUUID()
  // institutionId?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChildDto)
  children?: ChildDto[];

  @IsOptional()
  @IsString()
  parentName?: string;

  @IsOptional()
  @IsString()
  motherName?: string;

  @IsOptional()
  @IsString()
  spouseName?: string;

  @IsOptional()
  @IsString()
  relationshipType?: string;

  @IsOptional()
  @IsString()
  documentContact?: string;

  @IsOptional()
  @IsString()
  contactName?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsString()
  area?: string;

  @IsOptional()
  @IsString()
  jobTitle?: string;

  @IsOptional()
  @IsUUID()
  cargoId?: string;
}
