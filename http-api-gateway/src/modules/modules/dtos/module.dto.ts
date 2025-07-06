import { IsUUID, IsString, IsOptional } from 'class-validator';

export class ModuleDto {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsString()
  path: string;

  @IsOptional()
  children?: ModuleDto[];
}
