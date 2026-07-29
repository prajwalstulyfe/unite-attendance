import { IsString, IsNotEmpty, IsEnum, IsOptional, IsObject } from 'class-validator';
import { Plan } from '@prisma/client';

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  slug!: string;

  @IsEnum(Plan)
  @IsOptional()
  plan?: Plan;

  @IsObject()
  @IsOptional()
  settings?: Record<string, unknown>;
}

export class UpdateOrganizationDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  logo?: string;

  @IsEnum(Plan)
  @IsOptional()
  plan?: Plan;

  @IsObject()
  @IsOptional()
  settings?: Record<string, unknown>;
}
