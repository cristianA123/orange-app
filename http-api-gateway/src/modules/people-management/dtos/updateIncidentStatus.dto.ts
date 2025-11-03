import { IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateIncidentStatusDTO {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  status?: number;
  id: string;
}
