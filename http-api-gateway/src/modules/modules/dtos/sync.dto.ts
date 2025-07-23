import { IsArray, ArrayNotEmpty, IsUUID } from 'class-validator';

export class SyncModuleUserDto {
  @IsUUID()
  userId: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  modulesIds: string[];
}

export class SyncModuleInstituteDto {
  @IsUUID()
  instituteId: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  modulesIds: string[];
}
