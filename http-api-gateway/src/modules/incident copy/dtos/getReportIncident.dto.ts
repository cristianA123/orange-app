import {IsOptional, IsDateString, IsString, IsInt, Min, IsBoolean} from 'class-validator';
import { Type } from 'class-transformer';

export class GetReportIncidentDto {
    @IsOptional()
    @IsDateString()
    from?: string;

    @IsOptional()
    @IsDateString()
    to?: string;

    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    isRelevant?: boolean;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 10;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1
}