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


@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  

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
    const { email } = loginDto;
   
    const user=await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
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
    
    return user;
  }

  async exists(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return false;
    }
    return true;
  }

  async register(registerDto: RegisterDto): Promise<UserProfileDto> {
    const { email, username } = registerDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

   

    const user = await this.prisma.user.create({
      data: {
        email,
        username
      },
    });


  return user;
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
  async verifyRefreshToken(refreshToken: string, userId: number): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (!user.refreshToken) {
      throw new HttpException(
        'No refresh token found',
        HttpStatus.UNAUTHORIZED,
      );
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

  async logout(userId: number): Promise<any> {
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
    return {
      status: HttpStatus.OK,
      message: 'Logout successful from test',
    };
  }
}
