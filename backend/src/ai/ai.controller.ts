import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AiService } from './ai.service';
import { AiChatDto } from './dto/ai-chat.dto';
import { AiLessonDto } from './dto/ai-lesson.dto';
import { AiAdviceDto } from './dto/ai-advice.dto';
import { AiGameDto } from './dto/ai-game.dto';
import { AiQuizDto } from './dto/ai-quiz.dto';

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

  /**
   * POST /ai/advice
   * Appelé par : frontend/services/aiServiceApi.ts → getAiAdvice()
   * Utilisé dans : MiniJeu.tsx (après soumission du quiz)
   * → Envoie le score à Mistral qui génère un feedback personnalisé
   */
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

  /**
   * POST /ai/game
   * Appelé par : frontend/services/aiMiniGameApi.ts → getAiMiniGame()
   * Utilisé dans : MiniJeu.tsx (bouton "Générer un défi")
   * → Génère un jeu complet (timed-quiz, fill-code, ou logic-puzzle)
   *   avec questions, réponses et récompenses XP via Mistral AI
   */
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
