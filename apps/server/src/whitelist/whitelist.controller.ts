import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { WhitelistService } from './whitelist.service';

@Controller('whitelist')
export class WhitelistController {
  constructor(private readonly whitelistService: WhitelistService) {}

  @Post()
  async add(@Body() body: any) {
    return await this.whitelistService.addExtension(body);
  }
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return await this.whitelistService.updateExtension(id, body);
  }

  @Get()
  async list() {
    return await this.whitelistService.listExtensions();
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.whitelistService.removeExtension(id);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return await this.whitelistService.getExtension(id);
  }
}
