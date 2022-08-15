import { Controller, Get, Req, UseGuards } from '@nestjs/common';
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
    getMe(@GetUser() user: User) {
        return user;
    }
}
