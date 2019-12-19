import { Request, Response, Router } from "express";
import { BAD_REQUEST, CREATED, OK } from "http-status-codes";
import { logger, adminAuth, regularAuth } from "../shared";
import { validate } from "src/services/validate";

// Init shared
const router = Router();

/******************************************************************************
 *                      Get All user workouts - "GET /api/workout"
 ******************************************************************************/

router.get("/", regularAuth, async (req: Request, res: Response) => {});

/******************************************************************************
 *                       Add One - "POST /api/users/add"
 ******************************************************************************/

router.post("/add", adminAuth, async (req: Request, res: Response) => {});

export default router;
