import { Injectable } from '@nestjs/common';
import { CreateCollabDto } from './dto/create-collab.dto';
import { PrismaService } from '../prisma/prisma.service';
import { HttpStatus, HttpException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class CollabService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}
  async create(createCollabDto: CreateCollabDto, userId: number) {
    if (!userId) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'User not found',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const res = await this.prisma.collabGig.create({
      data: {
        name: createCollabDto.name,
        description: createCollabDto.description,
        userId: userId,
        roles: {
          create: createCollabDto.roles.map((role) => ({
            roleName: role.roleName,
          })),
        },
      },
      include: {
        roles: true,
      },
    });
    return {
      status: HttpStatus.OK,
      message: 'Collab created successfully',
      data: res,
    };
  }

  async getCollabs(scope: 'local' | 'global', email: string) {
    if (scope === 'local') {
      const domain = this.authService.getUserEmailDomain(email); // ← Use your auth method here

      // Find users with the same domain
      const usersWithSameDomain = await this.prisma.user.findMany({
        where: {
          email: {
            endsWith: `@${domain}`,
          },
        },
        select: { id: true },
      });

      const userIds = usersWithSameDomain.map((u) => u.id);

      return this.prisma.collabGig.findMany({
        where: {
          userId: { in: userIds },
        },
        include: {
          roles: true,
          user: true,
        },
      });
    }

    // Default to global: show all gigs
    return this.prisma.collabGig.findMany({
      include: {
        roles: true,
        user: true,
      },
    });
  }
}
// this is how you do it in nestjs
// this is the way you do it in nestjs
