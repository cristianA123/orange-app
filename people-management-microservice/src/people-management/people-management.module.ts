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
} from 'src/typeorm/entities';

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
    ]),
  ],
  controllers: [PeopleManagementController],
  providers: [PeopleManagementService],
  exports: [PeopleManagementService],
})
export class PeopleManagementModule {}
