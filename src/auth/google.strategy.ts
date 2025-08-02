import { Injectable } from '@nestjs/common'; // Import necessary decorators and classes
import { PassportStrategy } from '@nestjs/passport'; // 
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

// i will tell you what is happening exactly in here 
// i am using google outh strategy to authenticate users with their google accounts
// and once authenticated , i will generate a req.user object for them
// this req.user object will contain the userId and email along with JWT  of the authenticated user
@Injectable()
// we will be using google Ouath strategy to authenticate users
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
  
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID') || '',
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET') || '',
      callbackURL: 'http://https://nitappbackend.onrender.com/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string, // not really used but required by the strategy
    refreshToken: string, // not really used but required by the strategy
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails } = profile;
    const email = emails[0].value;

    // Check or create user
    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          username: name.givenName,
        },
      });
    }
    


    // Only attach selected fields to req.user
    const result = {
      userId: user.id,
      email: user.email,
    };
    const payload = {
      userId: user.id,
      email: user.email,
    };

  

    console.log('Google Strategy Result:', result);
done(null, { payload}); // we must pass both user and jwt to the done callback 
// this will allow us to access the user and jwt in the auth controller
// and we will use this jwt to authenticate the user in the future requests(by storing it in a cookie in the browser)
  }
}
