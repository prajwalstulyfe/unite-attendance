import { IsEmail, IsNotEmpty, IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { OrgRole } from '@prisma/client';

export class CreateMemberDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEnum(OrgRole)
  @IsOptional()
  role?: OrgRole;

  @IsString()
  @IsOptional()
  departmentId?: string;

  @IsString()
  @IsOptional()
  branchId?: string;

  @IsString()
  @IsOptional()
  employeeId?: string;

  @IsString()
  @IsOptional()
  designation?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}

export class UpdateMemberDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(OrgRole)
  @IsOptional()
  role?: OrgRole;

  @IsString()
  @IsOptional()
  departmentId?: string;

  @IsString()
  @IsOptional()
  branchId?: string;

  @IsString()
  @IsOptional()
  employeeId?: string;

  @IsString()
  @IsOptional()
  designation?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
