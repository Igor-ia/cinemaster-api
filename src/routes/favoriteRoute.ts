import { Router } from "express";

import * as FavoriteController from '../controllers/FavoriteController';
import loginRequired from "../middlewares/loginRequired";

const router = new (Router as any)();

router.get('/:userId', loginRequired, FavoriteController.index)

router.put('/:id', loginRequired, FavoriteController.favorite)


export default router;