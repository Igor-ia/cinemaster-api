import { Router } from "express";

import * as MovieController from '../controllers/MovieController'
import loginRequired from "../middlewares/loginRequired";

const router = new (Router as any)();



router.get('/', MovieController.index);
router.get('/search/:text', MovieController.search);
router.get('/added/:id', loginRequired, MovieController.show)
router.post('/add', loginRequired, MovieController.store)


export default router;