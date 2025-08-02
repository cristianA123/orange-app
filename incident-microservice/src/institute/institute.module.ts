import { Module } from '@nestjs/common';
import { InstituteService } from './institute.service';
import { InstituteController } from './institute.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Institute, User } from 'src/typeorm/entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, Institute])],
  controllers: [InstituteController],
  providers: [InstituteService],
  exports: [InstituteService],
})
export class InstituteModule {}

// @Module({
//   imports: [TypeOrmModule.forFeature([User, Institute])],
//   controllers: [UsersMicroserviceController],
//   providers: [UsersService],
//   exports: [UsersService],
// })
