import { NextFunction, Request, Response } from 'express';

import { User } from '../../models/user.model';

export const find = (req: Request, res: Response, next: NextFunction) => {
  // If a query string ?publicAddress=... is given, then filter results
  const whereClause = req.query &&
    req.query.publicAddress && {
      where: { publicAddress: req.query.publicAddress }
    };

  return User.findAll(whereClause)
    .then(users => res.json(users))
    .catch(err=>res.status(400).json({message:err.message}));
};

export const get = (req: Request, res: Response, next: NextFunction) => {
  // AccessToken payload is in req.user.payload, especially its `id` field
  // UserId is the param in /users/:userId
  // We only allow user accessing herself, i.e. require payload.id==userId
  if ((req as any).user.payload.id !== +req.params.userId) {
    return res.status(401).send({ error: 'You can can only access yourself' });
  }
  return User.findByPk(req.params.userId)
    .then(user => res.json(user))
    .catch(err=>res.status(400).json({message:err.message}));
};

export const create = (req: Request, res: Response, next: NextFunction) =>
  User.create(req.body)
    .then((user: User) => res.json(user))
    .catch(err=>res.status(400).json({message:err.message}));

export const patch = (req: Request, res: Response, next: NextFunction) => {
  // Only allow to fetch current user
  if ((req as any).user.payload.id !== +req.params.userId) {
    return res.status(401).send({ error: 'You can can only access yourself' });
  }
  return User.findByPk(req.params.userId)
    .then(async user => {
      if (!user) {
        return user;
      }

      Object.assign(user, req.body);
      return user.save();
    })
    .then(user => {
      return user
        ? res.json(user)
        : res.status(401).send({
            error: `User with publicAddress ${
              req.params.userId
            } is not found in database`
          });
    })
    .catch(err=>res.status(400).json({message:err.message}));
};
