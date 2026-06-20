import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly ai: AiService) {}

  @Post('chat')
  chat(@Body() body: { message: string; context?: string; lang?: string }) {
    return this.ai.chat({ message: body.message, context: body.context, lang: body.lang });
  }

  @Post('lesson')
  lesson(
    @Body()
    body: {
      lang?: string;
      courseTitle?: string;
      lessonTitle?: string;
      youtubeUrl?: string;
    },
  ) {
    return this.ai.lesson({
      lang: body.lang,
      courseTitle: body.courseTitle,
      lessonTitle: body.lessonTitle,
      youtubeUrl: body.youtubeUrl,
    });
  }

  @Post('simplify')
  simplify(
    @Body() body: { topic: string; context?: string; lang?: string },
  ) {
    return this.ai.simplify({ topic: body.topic, context: body.context, lang: body.lang });
  }

  @Post('example')
  example(
    @Body() body: { topic: string; context?: string; lang?: string },
  ) {
    return this.ai.example({ topic: body.topic, context: body.context, lang: body.lang });
  }

  @Post('summary')
  summary(@Body() body: { title?: string; text?: string; lang?: string }) {
    return this.ai.summary({ title: body.title, text: body.text, lang: body.lang });
  }

  @Post('advice')
  advice(
    @Body()
    body: {
      lastScore?: number;
      topic?: string;
      lang?: string;
      answers?: any;
    },
  ) {
    return this.ai.advice({
      lastScore: body.lastScore,
      topic: body.topic,
      lang: body.lang,
      answers: body.answers,
    });
  }

  @Post('recommend')
  recommend(@Body() body: { lastScore?: number; domains?: string[] }) {
    return this.ai.recommend({ lastScore: body.lastScore, domains: body.domains });
  }

  @Post('quiz')
  quiz(
    @Body()
    body: {
      lang?: string;
      topic?: string;
      count?: number;
      difficulty?: number;
    },
  ) {
    return this.ai.quiz({
      lang: body.lang,
      topic: body.topic,
      count: body.count,
      difficulty: body.difficulty,
    });
  }

  @Post('game')
  game(
    @Body()
    body: {
      lang?: string;
      topic?: string;
      lastScore?: number;
      level?: number;
    },
  ) {
    return this.ai.game({
      lang: body.lang,
      topic: body.topic,
      lastScore: body.lastScore,
      level: body.level,
    });
  }

  @Post('daily-game')
  dailyGame(
    @Body() body: { coursesTitles: string[]; level: number; lang?: string },
  ) {
    return this.ai.dailyGame({
      coursesTitles: body.coursesTitles,
      level: body.level,
      lang: body.lang,
    });
  }
}
