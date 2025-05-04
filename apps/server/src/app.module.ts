import { Module } from '@nestjs/common';
import { RiskModule } from './risk/risk.module';
import { WhitelistModule } from './whitelist/whitelist.module';
import { BlacklistModule } from './blacklist/blacklist.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [RiskModule, WhitelistModule, BlacklistModule, UserModule],
})
export class AppModule {}