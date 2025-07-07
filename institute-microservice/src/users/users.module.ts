import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersMicroserviceController } from './users.controller';
import { UsersService } from './users.service';
import { Institute, User } from 'src/typeorm/entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, Institute])],
  controllers: [UsersMicroserviceController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
