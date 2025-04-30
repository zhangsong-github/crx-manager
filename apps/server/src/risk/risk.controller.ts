import { Param, Body, Controller, Post, Get } from '@nestjs/common';
import { RiskService } from './risk.service';

@Controller('risk')
export class RiskController {
  constructor(private readonly riskService: RiskService) {}

  @Get('permissionmap')
  getAllPermissions() {
    return this.riskService.getPermissionMap();
  }
  @Get('permissions')
  getPermissions() {
    return this.riskService.getPermissions();
  }
  @Get('permissions/:name')
  getPermission(@Param('name') name: string) {
    return this.riskService.getPermission(name);
  }

  @Post('evaluate')
  evaluate(@Body() body: any) {
    return this.riskService.evaluateRisk(body);
  }
}