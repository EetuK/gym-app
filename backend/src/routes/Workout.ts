import { Request, Response, Router } from "express";
import { BAD_REQUEST, CREATED, OK, NO_CONTENT } from "http-status-codes";
import { logger, adminAuth, regularAuth } from "../shared";
import { validate } from "src/services/validate";
import {
  getWorkoutsByUserId,
  getWorkoutById
} from "src/services/workoutService";
import { isUndefined } from "util";

// Init shared
const router = Router();

/******************************************************************************
 *                      Get All user workouts - "GET /api/workout"
 ******************************************************************************/
/** @swagger
 *
 * /api/workout:
 *   get:
 *     tags: [Workout]
 *     description: Get all user workouts
 *     produces:
 *       - application/json
 */
router.get("/", regularAuth, async (req: Request, res: Response) => {
  const { userId } = res.locals;

  try {
    const workouts = await getWorkoutsByUserId(userId);

    if (isUndefined(workouts)) {
      return res
        .status(NO_CONTENT)
        .json({})
        .end();
    }

    return res
      .status(OK)
      .json(workouts)
      .end();
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      Get One Workout - "GET /api/workout/:id"
 ******************************************************************************/
/** @swagger
 *
 * /api/workout/{id}:
 *   get:
 *     tags: [Workout]
 *     description: Get one Workout
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: workout
 *         in: path
 *     responses:
 *       '200':
 *         description: Success
 */

router.get("/:id", regularAuth, async (req: Request, res: Response) => {
  const { userId } = res.locals;
  const { id } = req.params;

  try {
    const workout = await getWorkoutById(userId, (id as unknown) as number);

    if (isUndefined(workout)) {
      return res
        .status(NO_CONTENT)
        .json({})
        .end();
    }

    return res
      .status(OK)
      .json(workout)
      .end();
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                       Add One - "POST /api/users/add"
 ******************************************************************************/

router.post("/add", adminAuth, async (req: Request, res: Response) => {});

export default router;
