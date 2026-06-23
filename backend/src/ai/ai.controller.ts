import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AiService } from './ai.service';
import { AiChatDto } from './dto/ai-chat.dto';
import { AiLessonDto } from './dto/ai-lesson.dto';
import { AiAdviceDto } from './dto/ai-advice.dto';
import { AiGameDto } from './dto/ai-game.dto';
import { AiQuizDto } from './dto/ai-quiz.dto';

/**
 * API IA — consomme l'API externe Mistral (mistral-small-latest).
 * Utilisée par le chatbot, les leçons IA et les mini-jeux du frontend.
 */
@ApiTags('Intelligence artificielle (Mistral)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly ai: AiService) {}

  @ApiOperation({ summary: 'Chat avec le tuteur IA Mistral' })
  @Post('chat')
  chat(@Body() body: AiChatDto) {
    return this.ai.chat(body);
  }

  @ApiOperation({ summary: 'Explication approfondie d\'un chapitre' })
  @Post('lesson')
  lesson(@Body() body: AiLessonDto) {
    return this.ai.lesson(body);
  }

  @Post('simplify')
  simplify(@Body() body: { topic: string; context?: string; lang?: string }) {
    return this.ai.simplify(body);
  }

  @Post('example')
  example(@Body() body: { topic: string; context?: string; lang?: string }) {
    return this.ai.example(body);
  }

  @Post('summary')
  summary(@Body() body: { title?: string; text?: string; lang?: string }) {
    return this.ai.summary(body);
  }

  @ApiOperation({ summary: 'Conseils après un quiz' })
  @Post('advice')
  advice(@Body() body: AiAdviceDto) {
    return this.ai.advice(body);
  }

  @Post('recommend')
  recommend(@Body() body: { lastScore?: number; domains?: string[] }) {
    return this.ai.recommend(body);
  }

  @ApiOperation({ summary: 'Générer un quiz avec Mistral' })
  @Post('quiz')
  quiz(@Body() body: AiQuizDto) {
    return this.ai.quiz(body);
  }

  @ApiOperation({ summary: 'Mini-jeu pédagogique généré par IA' })
  @Post('game')
  game(@Body() body: AiGameDto) {
    return this.ai.game(body);
  }

  @Post('daily-game')
  dailyGame(@Body() body: { coursesTitles: string[]; level: number; lang?: string }) {
    return this.ai.dailyGame(body);
  }
}
