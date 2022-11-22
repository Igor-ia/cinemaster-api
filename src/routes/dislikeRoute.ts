import { Router } from "express";

import * as DislikeController from '../controllers/DislikeController';
import loginRequired from "../middlewares/loginRequired";

const router = new (Router as any)();

router.delete('/:id', loginRequired, DislikeController.dislike)

export default router;