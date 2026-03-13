import { Router, type IRouter } from "express";
import healthRouter from "./health";
import adminRouter from "./admin";
import userRouter from "./user";
import protectRouter from "./protect";

const router: IRouter = Router();

router.use(healthRouter);
router.use(adminRouter);
router.use(userRouter);
router.use(protectRouter);

export default router;
