import { Request, Response, Router } from "express";
import { BAD_REQUEST, CREATED, OK, NO_CONTENT } from "http-status-codes";
import { logger, adminAuth, regularAuth } from "../shared";
import {
  validate,
  requiredNameValidator,
  requiredInfoValidator
} from "src/services/validate";
import {
  getWorkoutsByUserId,
  getWorkoutById,
  createWorkout,
  deleteWorkout
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
/** @swagger
 *
 * /api/workout:
 *   post:
 *     tags: [Workout]
 *     description: Create new workout
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: name
 *         description: Name of the workout
 *         required: true
 *         type: string
 *       - name: info
 *         description: More info of the workout
 *         required: true
 *         type: string
 */
router.post("/", regularAuth, async (req: Request, res: Response) => {
  const { userId } = res.locals;

  try {
    const { value: move, error } = validate(
      {
        ...requiredNameValidator,
        ...requiredInfoValidator
      },
      req.body
    );

    if (error) {
      return res.status(BAD_REQUEST).json({
        error: error.message
      });
    }

    const { name, info } = move;
    const result = await createWorkout({ userId, name, info });

    return res
      .status(CREATED)
      .json(result)
      .end();
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                       Delete One - "DELETE /api/workout/{id}"
 ******************************************************************************/
/** @swagger
 *
 * /api/workout/{id}:
 *   delete:
 *     tags: [Workout]
 *     description: Delete a Workout
 *     produces:
 *       - application/json
 *     parameters:
 *       - id: id
 *         in: path
 *         description: ID of the Workout
 *         required: true
 *         type: string
 */
router.delete("/:id", regularAuth, async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await deleteWorkout((id as unknown) as number);

    return res.status(NO_CONTENT).end();
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

export default router;
