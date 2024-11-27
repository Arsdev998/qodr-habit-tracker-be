import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EvaluationGeneralService } from './evaluation.general.service';
import { EvaluationGeneralDto } from './evaluation.general.dto';
import { getUser } from 'src/auth/decorators/get.user.decorator';
import { userPayload } from 'src/types/userPayload';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('evaluationgeneral')
export class EvaluationGeneralController {
  constructor(
    private readonly evaluarionGeneralService: EvaluationGeneralService,
  ) {}

  @Get('')
  async getEvaluationGeneral(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    return this.evaluarionGeneralService.getEvaluationGeneral(
      pageNumber,
      limitNumber,
    );
  }
  @Post('post')
  async postEvaluationGeneral(@Body() data: EvaluationGeneralDto) {
    return this.evaluarionGeneralService.createEvalutaion(data);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/update/:id')
  async updateEvaluationGeneral(
    @Param('id') id: string,
    @Body() data: EvaluationGeneralDto,
    @getUser() user: userPayload,
  ) {
    return this.evaluarionGeneralService.updateEvaluation(id, data, user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/delete/:id')
  async deleteEvaluationGeneral(
    @Param('id') id: string,
    @getUser() user: userPayload,
  ) {
    return this.evaluarionGeneralService.deleteEvaluation(id, user.sub);
  }
}
