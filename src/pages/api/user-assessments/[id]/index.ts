import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { userAssessmentValidationSchema } from 'validationSchema/user-assessments';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.user_assessment
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getUserAssessmentById();
    case 'PUT':
      return updateUserAssessmentById();
    case 'DELETE':
      return deleteUserAssessmentById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getUserAssessmentById() {
    const data = await prisma.user_assessment.findFirst(convertQueryToPrismaUtil(req.query, 'user_assessment'));
    return res.status(200).json(data);
  }

  async function updateUserAssessmentById() {
    await userAssessmentValidationSchema.validate(req.body);
    const data = await prisma.user_assessment.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteUserAssessmentById() {
    const data = await prisma.user_assessment.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
