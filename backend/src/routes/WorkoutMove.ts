import { Request, Response, Router } from "express";
import { regularAuth, logger } from "@shared";
import {
  getWorkoutMoves,
  deleteWorkoutMove,
  createWorkoutMove
} from "src/services/workoutMoveService";
import { OK, BAD_REQUEST, NO_CONTENT, CREATED } from "http-status-codes";
import { isUndefined } from "util";
import {
  requiredWorkoutIdValidator,
  requiredMoveIdValidator,
  validate
} from "src/services/validate";
import { createMove } from "src/services/moveService";

const router = Router();

/******************************************************************************
 *                      Get All Moves Of A Workout - "GET /api/workoutmove"
 ******************************************************************************/
/** @swagger
 *
 * /api/workoutmove/{id}:
 *   get:
 *     tags: [WorkoutMove]
 *     description: Get all moves of a workout
 *     produces:
 *       - application/json
 */
router.get("/:id", regularAuth, async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await getWorkoutMoves((id as unknown) as number);

    if (isUndefined(result)) {
      return res
        .status(NO_CONTENT)
        .json({})
        .end();
    }

    return res
      .status(OK)
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
 *                       Add One - "POST /api/workoutmove"
 ******************************************************************************/
/** @swagger
 *
 * /api/WorkoutMove:
 *   post:
 *     tags: [WorkoutMove]
 *     description: Create a new WorkoutMove
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: workoutId
 *         description: ID of the Workout
 *         required: true
 *         type: string
 *       - name: moveId
 *         description: ID of the Move
 *         required: true
 *         type: string
 */
router.post("/", regularAuth, async (req: Request, res: Response) => {
  try {
    const { value: workoutMove, error } = validate(
      {
        ...requiredWorkoutIdValidator,
        ...requiredMoveIdValidator
      },
      req.body
    );

    console.log(req.body);

    if (error) {
      return res.status(BAD_REQUEST).json({
        error: error.message
      });
    }

    const { workoutId, moveId } = workoutMove;
    const result = await createWorkoutMove({ workoutId, moveId });

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
 *                       Delete One - "DELETE /api/workoutmove/{id}"
 ******************************************************************************/
/** @swagger
 *
 * /api/workoutmove/{id}:
 *   delete:
 *     tags: [WorkoutMove]
 *     description: Delete a WorkoutMove
 *     produces:
 *       - application/json
 *     parameters:
 *       - id: id
 *         in: path
 *         description: ID of the Workout
 *         required: true
 *         type: number
 *       - name: moveId
 *         description: ID of the Move
 *         required: true
 *         type: number
 */
router.delete("/:id", regularAuth, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { moveId } = req.body;

  try {
    await deleteWorkoutMove((id as unknown) as number, moveId);

    return res.status(NO_CONTENT).end();
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

export default router;
