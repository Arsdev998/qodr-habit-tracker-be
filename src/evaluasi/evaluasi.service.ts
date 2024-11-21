import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma_config/prisma.service';
import { EvaluationDto } from './evaluation.dto';

@Injectable()
export class EvaluationServices {
  constructor(private readonly prisma: PrismaService) {}

  async getEvaluations(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const evaluations = await this.prisma.evaluation.findMany({
      skip,
      take: limit,
    });
    const total = await this.prisma.evaluation.count();

    return {
      data: evaluations,
      meta: {
        total, // Total items in the database
        page,
        limit,
        totalPages: Math.ceil(total / limit), // Total pages
      },
    };
  }

  async postEvaluation(data: EvaluationDto) {
    if (!data) {
      throw new InternalServerErrorException('Field missing');
    }
    console.log(data);
    const createEvaluation = await this.prisma.evaluation.create({
      data: {
        about: data.about,
        problem: data.problem,
      },
    });

    return {
      message: 'Success Create Evaluation',
    };
  }
}
