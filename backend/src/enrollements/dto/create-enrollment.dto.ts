import {
 IsNumber,
 IsBoolean
} from 'class-validator';

export class CreateEnrollmentDto {

 @IsNumber()
 userId: number;

 @IsNumber()
 courseId: number;

 @IsNumber()
 amount: number;

 @IsBoolean()
 paid: boolean;
}