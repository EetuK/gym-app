import { Request, Response, Router } from "express";
import { BAD_REQUEST, CREATED, OK, NO_CONTENT } from "http-status-codes";
import { logger, adminAuth, regularAuth } from "../shared";
import { isUndefined } from "util";
import {
  optionalInfoValidator,
  validate,
  requiredWorkoutIdValidator,
  requiredMoveIdValidator,
  requiredWorkoutExecutionIdValidator,
  requiredInfoValidator,
  requiredRestingTimeValidator,
  requiredVibeValidator,
  requiredWeightValidator,
  requiredRepsValidator,
  requiredSetsValidator
} from "../services/validate";
import { createWorkoutExecution } from "../services/workoutExecutionService";
import { createMoveExecution } from "src/services/moveExecutionService";

const router = Router();

/******************************************************************************
 *                       Delete one - "DELETE /api/execution/workout/{id}"
 ******************************************************************************/
/** @swagger
 *
 * /api/execution/workout/{workoutExecutionId}:
 *   delete:
 *     tags: [WorkoutExecution]
 *     description: Create new workout execution
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: workoutExecutionId
 *         description: Id of the workout execution to be deleted
 *         required: true
 *         type: number
 */

/******************************************************************************
 *        Get workout execution by id - "GET /api/execution/workout/{id}"
 ******************************************************************************/
/** @swagger
 *
 * /api/execution/workout/{workoutExecutionId}:
 *   get:
 *     tags: [WorkoutExecution]
 *     description: Create new workout execution
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: workoutExecutionId
 *         description: Id of the workout execution
 *         required: true
 *         type: number
 */

/******************************************************************************
 *        Get workout executions - "GET /api/execution/workout"
 ******************************************************************************/
/** @swagger
 *
 * /api/execution/workout/:
 *   get:
 *     tags: [WorkoutExecution]
 *     description: Create new workout execution
 *     produces:
 *       - application/json
 *     parameters:
 */

/******************************************************************************
 *                       Add One - "POST /api/execution/workout"
 ******************************************************************************/
/** @swagger
 *
 * /api/execution/workout:
 *   post:
 *     tags: [WorkoutExecution]
 *     description: Create new workout execution
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: workoutId
 *         description: Id of the workout
 *         required: true
 *         type: string
 *       - name: info
 *         description: More info of the workout
 *         required: false
 *         type: string
 */
router.post("/workout", regularAuth, async (req: Request, res: Response) => {
  try {
    const { value, error } = validate(
      {
        ...requiredWorkoutIdValidator,
        ...optionalInfoValidator
      },
      req.body
    );

    if (error) {
      return res.status(BAD_REQUEST).json({
        error: error.message
      });
    }

    const { workoutId, info } = value;
    const result = await createWorkoutExecution({ workoutId, info });

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
 *                       Add One - "POST /api/execution/move"
 ******************************************************************************/
/** @swagger
 *
 * /api/execution/move:
 *   post:
 *     tags: [MoveExecution]
 *     description: Create new workout execution
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: workoutExecutionId
 *         description: Id of the workout_execution entity
 *         required: true
 *         type: string
 *       - name: move_id
 *         description: Id of the move
 *         required: true
 *         type: string
 *       - name: sets
 *         description: Number of the sets
 *         required: true
 *         type: number
 *       - name: reps
 *         description: Number of the reps
 *         required: true
 *         type: number
 *       - name: weight
 *         description: Weight in kilograms
 *         required: true
 *         type: number
 *       - name: vibe
 *         description: Feeling described as number from 1 - 5
 *         required: true
 *         type: number
 *       - name: resting_time
 *         description: Resting time in minutes
 *         required: true
 *         type: number
 *       - name: info
 *         description: Info about the move execution
 *         required: false
 *         type: string
 */
router.post("/move", regularAuth, async (req: Request, res: Response) => {
  try {
    const { value, error } = validate(
      {
        ...requiredWorkoutExecutionIdValidator,
        ...requiredMoveIdValidator,
        ...requiredSetsValidator,
        ...requiredRepsValidator,
        ...requiredWeightValidator,
        ...requiredVibeValidator,
        ...requiredRestingTimeValidator,
        ...optionalInfoValidator
      },
      req.body
    );

    if (error) {
      return res.status(BAD_REQUEST).json({
        error: error.message
      });
    }

    const result = await createMoveExecution(value);

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

export default router;
