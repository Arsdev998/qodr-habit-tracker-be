import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { EvaluationGeneralDto } from './evaluation.general.dto';
import { PrismaService } from 'src/prisma_config/prisma.service';

@Injectable()
export class EvaluationGeneralService {
  constructor(private readonly prisma: PrismaService) {}

  async getEvaluationGeneral(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const evaluations = await this.prisma.evaluationGeneral.findMany({
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            fullname: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    const total = await this.prisma.evaluationGeneral.count();

    return {
      data: evaluations,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  async createEvalutaion(data: EvaluationGeneralDto) {
    const { about, problem, userId } = data;
    if (!about || !problem || !userId) {
      throw new BadRequestException('Field Missing');
    }
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const existingEvaluation = await this.prisma.evaluationGeneral.findFirst({
      where: {
        userId: parseInt(userId),
        createdAt: {
          gte: oneDayAgo,
        },
      },
    });
    if (existingEvaluation) {
      const nextAllowed = new Date(
        existingEvaluation.createdAt.getTime() + 24 * 60 * 60 * 1000,
      );
      throw new BadRequestException(
        `Kamu baru bisa mengirim lagi pada ${nextAllowed}.`,
      );
    }
    const createEvaluation = await this.prisma.evaluationGeneral.create({
      data: {
        about: about,
        problem: problem,
        userId: parseInt(userId),
      },
    });
    return { message: 'Create Evaluation Success', createEvaluation };
  }

  async updateEvaluation(
    id: string,
    data: EvaluationGeneralDto,
    reqUserId: number,
  ) {
    const evaluation = await this.prisma.evaluationGeneral.findFirst({
      where: {
        id: parseInt(id),
      },
    });
    if (!evaluation) {
      throw new BadRequestException('Evaluation Not Found');
    }
    if (evaluation.userId.toString() !== reqUserId.toString()) {
      throw new UnauthorizedException(
        'Unauthorized You Not Cant Update This Evaluation',
      );
    }
    const updateEvaluation = await this.prisma.evaluationGeneral.update({
      where: {
        id: parseInt(id),
      },
      data: {
        about: data.about,
        problem: data.problem,
      },
    });
    return { message: 'Update Evaluation Success', updateEvaluation };
  }

  async deleteEvaluation(id: string, reqUserId: number) {
    const evaluation = await this.prisma.evaluationGeneral.findFirst({
      where: {
        id: parseInt(id),
      },
    });
    if (!evaluation) {
      throw new BadRequestException('Evaluation Not Found');
    }
    if (evaluation.userId.toString() !== reqUserId.toString()) {
      throw new UnauthorizedException(
        'Unauthorized You Not Cant Delete This Evaluation',
      );
    }
    const deleteEvaluation = await this.prisma.evaluationGeneral.delete({
      where: {
        id: parseInt(id),
      },
    });
    return {
      message: 'Success Delete Evaluation',
      data: deleteEvaluation,
    };
  }
}
