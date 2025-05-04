import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RiskModule } from '../risk/risk.module';

@Module({
  imports: [RiskModule],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {}