import { Router } from "express";
import { regularAuth } from "@shared";

const router = Router();

/******************************************************************************
 *                      Get All Moves Of A Workout - "GET /api/workoutmove"
 ******************************************************************************/
/** @swagger
 *
 * /api/workoutmove:
 *   get:
 *     tags: [Workout Move]
 *     description: Get all moves of a workout
 *     produces:
 *       - application/json
 */
router.get("/", regularAuth, () => {});

export default router;
