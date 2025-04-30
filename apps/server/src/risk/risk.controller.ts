import { Body, Controller, Post } from '@nestjs/common';
import { RiskService } from './risk.service';

@Controller('risk')
export class RiskController {
  constructor(private readonly riskService: RiskService) {}

  @Post('evaluate')
  evaluate(@Body() body: any) {
    return this.riskService.evaluateRisk(body);
  }
}