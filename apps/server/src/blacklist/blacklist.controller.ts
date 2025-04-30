import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { BlacklistService } from './blacklist.service';

@Controller('blacklist')
export class BlacklistController {
  constructor(private readonly blacklistService: BlacklistService) {}

  @Post()
  async add(@Body() body: any) {
    return await this.blacklistService.addExtension(body);
  }

  @Get()
  async list() {
    return await this.blacklistService.listExtensions();
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.blacklistService.removeExtension(id);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return await this.blacklistService.getExtension(id);
  }
}
