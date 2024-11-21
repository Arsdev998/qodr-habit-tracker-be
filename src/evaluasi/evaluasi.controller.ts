import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { EvaluationServices } from './evaluasi.service';
import { EvaluationDto} from './evaluation.dto';

@Controller('evaluation')
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationServices) {}

  @Get()
  async getEvaluation(
    @Query('page') page: string, 
    @Query('limit') limit: string,
  ) {
    const pageNumber = parseInt(page, 10) || 1; // Konversi ke integer dengan default 1
    const limitNumber = parseInt(limit, 10) || 10; // Konversi ke integer dengan default 10
    return await this.evaluationService.getEvaluations(pageNumber, limitNumber);
  }

  @Post('post')
  async postEvaluation(@Body() data: EvaluationDto) {
    return this.evaluationService.postEvaluation(data);
  }
}
