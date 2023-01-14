import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto';
import * as argon from 'argon2';
import { UserType } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

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

      return this.signToken(user.id, user.email, user.userType);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(`${error.meta.target[0]} is taken!`);
        }
      }
      throw error;
    }
  }

  async signin(loginDto: LoginDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: loginDto.email,
      },
    });

    if (!user) throw new ForbiddenException('Invalid email');

    const pwMatches = await argon.verify(user.password, loginDto.password);

    if (!pwMatches) throw new ForbiddenException('Invalid password');

    return this.signToken(user.id, user.email, user.userType);
  }

  async signToken(userId: string, email: string, userType: UserType): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email: email,
      userType: userType,
    };
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '60m',
      secret: this.config.get('JWT_SECRET'),
    });
    return {
      access_token: token,
    };
  }

  async invalidateToken(token: string) {} // TODO

  async forgotPassword() {} // TODO
}
