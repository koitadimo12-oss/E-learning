import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { ProgressService } from './progress.service';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';

@ApiTags('Progression')
@ApiBearerAuth()
@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private readonly progress: ProgressService) {}

  @ApiOperation({ summary: 'Ma progression sur tous les cours' })
  @Get()
  listMine(@CurrentUser() user: User) {
    return this.progress.listForUser(user);
  }

  @ApiOperation({ summary: 'Ma progression sur un cours' })
  @Get('me/:courseId')
  getMine(@CurrentUser() user: User, @Param('courseId') courseId: string) {
    return this.progress.getMine(user, courseId);
  }

  @ApiOperation({ summary: 'Mettre à jour ma progression' })
  @Patch(':courseId')
  updateMine(
    @CurrentUser() user: User,
    @Param('courseId') courseId: string,
    @Body() dto: UpdateProgressDto,
  ) {
    return this.progress.updateProgress(user, courseId, dto);
  }

  @ApiOperation({ summary: 'Soumettre un quiz' })
  @Post('submit-quiz')
  submitQuiz(@CurrentUser() user: User, @Body() dto: SubmitQuizDto) {
    return this.progress.submitQuiz(user, dto);
  }
}
