// Based on https://github.com/vercel/next.js/discussions/16417#discussioncomment-6489765

import fs from 'fs';
import path from 'path';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { dir } = req.query;

  if (!dir || !Array.isArray(dir) || dir.length !== 2) {
    res.status(400);
    return;
  }

  try {
    const filePath = path.join(process.cwd(), 'public', dir[0], dir[1]);

    const data = fs.readFileSync(filePath);
    res.status(200).send(data);
    return;
  } catch (error) {
    console.log(error);
    res.status(500);
    return;
  }
}
