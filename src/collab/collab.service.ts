// 
import { Injectable } from '@nestjs/common';
import { CreateCollabDto } from './dto/create-collab.dto';
import { PrismaService } from '../prisma/prisma.service';
import { HttpStatus, HttpException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { ApplyDto } from './dto/apply.dto';
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


  async applyCollab(apply:ApplyDto, userId: number) {
    const { roleId , message } = apply;

    const existing= await this.prisma.collabApplication.findFirst({
      where: {
        roleId,
        userId,
      },
    });

    if (existing) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'You have already applied for this role',
        },
        HttpStatus.BAD_REQUEST,
      );
    }


    const application = await this.prisma.collabApplication.create({
      data: {
        roleId,
        userId,
        message,
      },
    });

    return {
      status: HttpStatus.OK,
      message: 'Application submitted successfully',
      data: application,
    };

  }


  async getUserEmailDomain(email: string): Promise<string> {
    const atIndex = email.indexOf('@');
    if (atIndex === -1) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Invalid email format',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return email.slice(atIndex + 1);
  }

  async getCollabs(scope: 'local' | 'global', email: string) {
    if (scope === 'local') {
      const domain = await this.getUserEmailDomain(email);

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
          user: {
            select: {
              id: true,
              email: true,
            },
          },
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

  async getCollabById(id: number) {
    const collab = await this.prisma.collabGig.findUnique({
      where: { id },
      include: {
        roles: true,
        user: true,
      },
    });

    if (!collab) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Collab not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return collab;
  }


  async deleteGig(id: number) {
    const gig = await this.prisma.collabGig.findUnique({
      where: { id },
    });
    if (!gig) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Collab gig not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
   
    const roles = await this.prisma.collabRole.findMany({
      where: { gigId: id },
    });
    

const roleIds = roles.map((role) => role.id);

    await this.prisma.collabApplication.deleteMany({
      where: { roleId: { in: roleIds } },
    });

    await this.prisma.collabRole.deleteMany({
      where: { gigId: id },
    });

    await this.prisma.collabGig.delete({
      where: { id },
    });

    return {
      status: HttpStatus.OK,
      message: 'Collab gig deleted successfully',
    };
  }

 async deleteapplication(id: number) {
    const application = await this.prisma.collabApplication.findUnique({
      where: { id },
    });

    if (!application) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Application not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    await this.prisma.collabApplication.delete({
      where: { id },
    });


    await this.prisma.collabRole.deleteMany({
      where: { id: id },  
    });

    return {
      status: HttpStatus.OK,
      message: 'Application deleted successfully',
    };
 }
}
// this is how you do it in nestjs
// this is the way you do it in nestjs
