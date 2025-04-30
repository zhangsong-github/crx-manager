import { Module } from '@nestjs/common';
import { RiskModule } from './risk/risk.module';
import { WhitelistModule } from './whitelist/whitelist.module';
import { BlacklistModule } from './blacklist/blacklist.module';

@Module({
  imports: [RiskModule, WhitelistModule, BlacklistModule],
})
export class AppModule {}