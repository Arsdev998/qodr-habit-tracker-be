import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { EvaluationServices } from './evaluasi.service';
import { EvaluationDto} from './evaluation.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

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


  @UseGuards(JwtAuthGuard)
  @Post('post')
  async postEvaluation(@Body() data: EvaluationDto, @Req() req: any) {
    const identifier = req.ip
    return this.evaluationService.postEvaluation(data,identifier);
  }
}
