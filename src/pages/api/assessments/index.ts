import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { assessmentValidationSchema } from 'validationSchema/assessments';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getAssessments();
    case 'POST':
      return createAssessment();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getAssessments() {
    const data = await prisma.assessment
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'assessment'));
    return res.status(200).json(data);
  }

  async function createAssessment() {
    await assessmentValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.user_assessment?.length > 0) {
      const create_user_assessment = body.user_assessment;
      body.user_assessment = {
        create: create_user_assessment,
      };
    } else {
      delete body.user_assessment;
    }
    const data = await prisma.assessment.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
