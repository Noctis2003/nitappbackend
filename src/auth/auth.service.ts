import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  constructor(private prisma: PrismaService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });
    if (user && user.password === pass) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  login(user: Omit<User, 'password'>) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async register(username: string, password: string) {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { username },
      });
      if (existingUser) {
        throw new Error('User already exists');
      }
    } catch (error) {
      console.error('Error checking for existing user:', error);
    }

    try {
      const user = await this.prisma.user.create({
        data: {
          username,
          password,
        },
      });
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
    }
  }
  // that is it // that is how you do it
}
