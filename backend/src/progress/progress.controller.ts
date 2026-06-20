import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { ProgressService } from './progress.service';
import { SubmitQuizDto } from './dto/submit-quiz.dto';

@Controller('progress')
export class ProgressController {
  constructor(private readonly progress: ProgressService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me/:courseId')
  getMine(@CurrentUser() user: User, @Param('courseId') courseId: string) {
    return this.progress.getMine(user, courseId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('submit-quiz')
  submitQuiz(@CurrentUser() user: User, @Body() dto: SubmitQuizDto) {
    return this.progress.submitQuiz(user, dto);
  }
}

