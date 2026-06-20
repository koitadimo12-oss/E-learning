import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { CertificatesService } from './certificates.service';

@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certs: CertificatesService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  mine(@CurrentUser() user: User) {
    return this.certs.myCertificates(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('issue/:courseId')
  issue(
    @CurrentUser() user: User,
    @Param('courseId') courseId: string,
    @Body() body: { projectUrl?: string; projectNote?: string },
  ) {
    return this.certs.issueForCourse(user, courseId, body);
  }
}

