import { handleCallback } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from '@auth0/nextjs-auth0';

export const GET = handleCallback({
  afterCallback: async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
    return session;
  }
}); 