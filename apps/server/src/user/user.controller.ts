import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async add(@Body() body: any) {
    return await this.userService.addUser(body);
  }
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return await this.userService.updateUser(body);
  }

  @Get()
  async list() {
    return await this.userService.listUsers();
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.userService.removeUser(id);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return await this.userService.getUser(id);
  }
}
