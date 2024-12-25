

import { NextApiRequest, NextApiResponse } from 'next';

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, password } = req.body; 


    if (username === 'test' && password === 'password') {

      res.status(200).json({ token: 'fake-token' });
    } else {
      res.status(401).json({ message: 'Неверные данные для входа' });
    }
  } else {
    res.status(405).json({ message: 'Метод не поддерживается' });
  }
}
