import { IsArray, ArrayNotEmpty, IsUUID } from 'class-validator';

export class SyncModuleDto {
  @IsUUID()
  userId: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  modulesIds: string[];
}
