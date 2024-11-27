import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
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
      orderBy:{
        createdAt: 'desc',
      }
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

  async postEvaluation(data: EvaluationDto, identifier: string) {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const existingEvaluation = await this.prisma.evaluation.findFirst({
      where: {
        identifier,
        createdAt: {
          gte: oneDayAgo, // Dalam 24 jam terakhir
        },
      },
    });

    if (existingEvaluation) {
       const nextAllowed = new Date(
         existingEvaluation.createdAt.getTime() + 24 * 60 * 60 * 1000,
       );
      throw new BadRequestException(`Kamu baru bisa mengirim lagi pada ${nextAllowed}.`);
    }
    if (!data) {
      throw new InternalServerErrorException('Field missing');
    }
    const createEvaluation = await this.prisma.evaluation.create({
      data: {
        about: data.about,
        problem: data.problem,
        identifier: identifier,
      },
    });

    return {
      message: 'Success Create Evaluation',
      data: createEvaluation,
    };
  }
}
