import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class SubmitQuizDto {
  @IsString()
  courseId: string;

  @IsString()
  moduleId: string;

  @IsString()
  quizId: string;

  @IsArray()
  @ArrayNotEmpty()
  answers: number[]; // index per question
}

