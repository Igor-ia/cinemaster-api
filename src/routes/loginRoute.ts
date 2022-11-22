import { Router } from "express";

import * as LoginController from '../controllers/LoginController'

const router = new (Router as any)();



router.post('/register', LoginController.register)

router.post('/token', LoginController.loginToken)


export default router;