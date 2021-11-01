import { Response } from 'express';

export const defaultController = (res: Response) =>
  res.status(200).send({ status: 'ok' });
export const wrongMethodController = (res: Response) =>
  res.status(400).send({ status: 'Bad request' });
