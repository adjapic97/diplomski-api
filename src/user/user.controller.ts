import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { User, UserType } from '@prisma/client';
import { GetUser, Roles } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Excluder } from 'src/util';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtGuard, RolesGuard)
  @Get('me')
  @Roles(UserType.ADMIN)
  async getMe(@GetUser() user: User, @Query() params) {
    try {
      let include = params.includeSkills === 'true';
      return await this.userService.findOne(user.id, include);
    } catch (error) {
      return new NotFoundException(error);
    }
  }

  @UseGuards(JwtGuard)
  @Get('get-user-skills')
  @Roles(UserType.EMPlOYEE)
  async getSkillsForUser(@Query() params) {
    try {
      return await this.userService.getUserSkills(params.userId);
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  @UseGuards(JwtGuard)
  @Get('get-user-skills-by-level')
  @Roles(UserType.EMPlOYEE)
  async getSkillsByLevel(@Query() params) {
    try {
      let skills = await this.userService.getUserSkillsByLevel(
        params.userId,
        params.level,
      );
      return skills;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Post('set-skill')
  async setSkills(@Body() body, @GetUser() user: User) {
    let messages = [];
    let skillsForUser = await this.userService.getUserSkills(user.id);
    body.skills.forEach((skill) => {
      const isFound = skillsForUser.some((skillOnUser) => {
        if (skillOnUser.skill.name == skill.skillName) {
          return true;
        } else {
          return false;
        }
      });
      if (isFound) {
        messages.push(`Skill ${skill.skillName} already exists on this user`);
        return;
      }
      this.userService.addSkillToUser(skill, user).then((ret) => {
        console.log(ret);
      });
    });
    return messages;
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Get('get-users-on-skill')
  @Roles(UserType.EMPLOYER, UserType.ADMIN)
  async returnAllUsersForSkill(@Body() body) {
    if (!body.skillId) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'you are missing a skillId ',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    let users = await this.userService.findAllUsersOnSkill(body.skillId);
    users.map((user) => Excluder.exclude(user, 'password'));
    return users;
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Get('get-unique-skills')
  async findAllNonAssignedSkills(@Body() body) {
    if (!body.userId) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'you are missing a userId parameter ',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    let skills = await this.userService.findUniqueSkills(body.userId);
    return skills;
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Post('delete-user')
  async deleteUser(@Body() body) {
    if (!body.userId) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'you are missing a userId parameter ',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.userService.softUserDelete(body.userId);
  }

}
