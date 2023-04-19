import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '~/prisma/client';

export default async function API(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    res.status(401).json({
      error: 'You must sign in'
    });
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  // @ts-expect-error: ???
  const userId = session.user.id as string;

  if (!userId) {
    res.status(401).json({
      error: 'You must sign in'
    });
    return;
  }

  const invites = await prisma.invite.findUnique({
    where: {
      userId
    }
  });

  if (req.method === 'GET') {
    res.status(200).json({
      code: invites?.code
    });
    return;
  } else if (req.method === 'POST') {
    if (invites) {
      res.status(403).json({
        error: 'You already have an invite'
      });
      return;
    }

    try {
      await prisma.invite.create({
        data: {
          userId
        }
      });

      const code = await getInvite();

      await prisma.invite.update({
        where: {
          userId
        },
        data: {
          code
        }
      });

      res.status(200).json({
        code
      });
    } catch (error) {
      res.status(500).json({
        error: 'Something went wrong'
      });

      await prisma.invite.deleteMany({
        where: {
          userId,
          code: null
        }
      });
      return;
    }
  }
}

const getInvite = async () => {
  const domain = process.env.NEXT_PUBLIC_MISSKEY_DOMAIN;
  const token = process.env.MISSKEY_TOKEN;
  if (!domain || !token) {
    throw new Error('Missing Misskey domain or token');
  }

  const res = await fetch(`https://${domain}/api/invite`, {
    method: 'POST',
    body: JSON.stringify({
      i: token
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) {
    throw new Error('Failed to get invite');
  }

  const { code } = (await res.json()) as { code: string };

  return code;
};
