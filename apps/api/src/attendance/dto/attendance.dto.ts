import { IsNotEmpty, IsString, IsObject, IsOptional, IsEnum } from 'class-validator';
import { AttendanceType } from '@prisma/client';

export class DeviceInfoDto {
  @IsString()
  userAgent!: string;

  @IsString()
  platform!: string;

  @IsString()
  @IsOptional()
  deviceId?: string;

  @IsString()
  @IsOptional()
  kioskId?: string;
}

export class GeoLocationDto {
  lat!: number;

  lng!: number;

  @IsOptional()
  accuracy?: number;
}

export class ScanAttendanceDto {
  @IsString()
  @IsNotEmpty()
  qrToken!: string;

  @IsObject()
  deviceInfo!: DeviceInfoDto;

  @IsObject()
  @IsOptional()
  gpsLocation?: GeoLocationDto;
}

export class ManualAttendanceDto {
  @IsString()
  @IsNotEmpty()
  memberId!: string;

  @IsEnum(AttendanceType)
  type!: AttendanceType;

  @IsString()
  @IsOptional()
  notes?: string;
}
