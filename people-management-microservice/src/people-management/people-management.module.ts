import { Module } from '@nestjs/common';
import { PeopleManagementService } from './people-management.service';
import { PeopleManagementController } from './people-management.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  People,
  User,
  Institute,
  Incident,
  Department,
  Province,
  District,
  Nationality,
  MaritalStatus,
  Origin,
  PensionSystem,
  LicenseA,
  LicenseB,
  EducationLevel,
  BloodType,
  EmergencyContactType,
  Child,
  Cargo,
  Contract,
  ContractType,
  Area,
  ContractFile,
} from 'src/typeorm/entities';
import { ContractService } from './contract.service';
import { S3Service } from './s3.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      People,
      User,
      Institute,
      Incident,
      Department,
      Province,
      District,
      Nationality,
      MaritalStatus,
      Origin,
      PensionSystem,
      LicenseA,
      LicenseB,
      EducationLevel,
      BloodType,
      EmergencyContactType,
      Child,
      Cargo,
      Contract,
      ContractType,
      Area,
      ContractFile,
    ]),
  ],
  controllers: [PeopleManagementController],
  providers: [PeopleManagementService, ContractService, S3Service],
  exports: [PeopleManagementService, ContractService, S3Service],
})
export class PeopleManagementModule { }
