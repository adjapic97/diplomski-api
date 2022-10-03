import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { User, UserType } from '@prisma/client';
import { GetUser, Roles } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { UserService } from './user.service';

@Controller('users')
export class UserController {

  constructor(private userService: UserService) {}

  @UseGuards(JwtGuard, RolesGuard)
  @Get('me')
  @Roles(UserType.ADMIN)
  async getMe(@GetUser() user: User): Promise<User> {
    return this.userService.findOne(user.id);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Post('set-skill')
  async setSkill(@Req() req : any, @GetUser() user: User) {}  
}
