// proper flow of the code
// first we have to generate the refresh token
// once generated we have to store it in the database(ie update the user)
// we also have to verify the refresh token

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserProfileDto } from './dto/user-profile.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  private async validateUser(
    email: string,
    pass: string,
  ): Promise<{ id: number; email: string } | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }

    return { id: user.id, email: user.email };
  }

  async generateTokens(userId: number, email: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload, {
      secret: 'qeqeqe',
      expiresIn: '1h',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: 'qeqeqe',
      expiresIn: '7d',
    });
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async login(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, { secret: 'qeqeqe' }),
      refresh_token: this.jwtService.sign(payload, {
        secret: 'qeqeqe',
        expiresIn: '7d',
      }),
      user: {
        id: user.id,
        email: user.email,
      },
      message: 'Login successful',
    };
  }

  async getUserProfile(userId: number): Promise<UserProfileDto> {
    if (!userId) {
      throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async register(registerDto: RegisterDto): Promise<UserProfileDto> {
    const { email, password, username } = registerDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getUserById(userId: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: Number(userId) },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }
  getUserEmailDomain(email: string): string {
    return email.split('@')[1];
  }
  async verifyRefreshToken(
    refreshToken: string,
    userId: number,
  ): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (!user.refreshToken) {
      throw new HttpException('No refresh token found', HttpStatus.UNAUTHORIZED);
    }
    return bcrypt.compare(refreshToken, user.refreshToken);
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: Number(userId) },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: Number(userId) },
      data: { refreshToken: hashedRefreshToken },
    });
  }

  async logout(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: Number(userId) },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    await this.prisma.user.update({
      where: { id: Number(userId) },
      data: { refreshToken: null },
    });
  }
}
