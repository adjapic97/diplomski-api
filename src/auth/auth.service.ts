import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto';
import * as argon from 'argon2';
import { UserType } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  async signup(dto: RegisterDto) {
    const hash = await argon.hash(dto.password);

    try {
      const user = await this.prismaService.user.create({
        data: {
          email: dto.email,
          password: hash,
          username: dto.username,
          firstName: dto.firstName,
          lastName: dto.lastName,
          phoneNumber: dto.phoneNumber,
          dateOfBirth: dto.dateOfBirth,
          userType: UserType[dto.userType],
        },
      });

      delete user.password;
      return { user: user };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(error.meta.target[0] + ' is taken!');
        }
      }
      throw error;
    }
  }

  async signin(loginDto: LoginDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
       email: loginDto.email,
      }
    });

    if (!user) throw new ForbiddenException('Invalid email');

    const pwMatches = await argon.verify(user.password, loginDto.password);

    if (!pwMatches) throw new ForbiddenException('Invalid password');

    delete user.password;
    return { user: user };
  }
}
