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
  requiredRestingTimeValidator,
  requiredVibeValidator,
  requiredWeightValidator,
  requiredRepsValidator,
  requiredSetsValidator
} from "../services/validate";
import {
  createWorkoutExecution,
  getWorkoutExecutionsByWorkoutId,
  deleteWorkoutExecutionById,
  getWorkoutExecutionById
} from "../services/workoutExecutionService";
import {
  createMoveExecution,
  deleteMoveExecutionById,
  updateMoveExecutionById
} from "../services/moveExecutionService";

const router = Router();

/******************************************************************************
 *                       Delete one - "DELETE /api/execution/workout/{workoutExecutionId}"
 ******************************************************************************/
router.delete(
  "/workout/:workoutExecutionId",
  regularAuth,
  async (req: Request, res: Response) => {
    const { workoutExecutionId } = req.params;
    try {
      if (!workoutExecutionId) {
        return res.status(BAD_REQUEST).json({
          error: "No workoutExecutionId!"
        });
      }

      const result = await deleteWorkoutExecutionById(workoutExecutionId);

      return res
        .status(NO_CONTENT)
        .json(result)
        .end();
    } catch (err) {
      logger.error(err.message, err);
      return res.status(BAD_REQUEST).json({
        error: err.message
      });
    }
  }
);

/******************************************************************************
 *        Get workout execution by id - "GET /api/execution/workout/{id}"
 ******************************************************************************/
router.get(
  "/workout/by-workout-id/:workoutId",
  regularAuth,
  async (req: Request, res: Response) => {
    const { workoutId } = req.params;
    try {
      if (!workoutId) {
        return res.status(BAD_REQUEST).json({
          error: "No workout id!"
        });
      }

      const result = await getWorkoutExecutionsByWorkoutId(workoutId);

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
  }
);

/******************************************************************************
 *        Get workout execution by id - "GET /api/execution/workout/{id}"
 ******************************************************************************/
router.get(
  "/workout/:workoutExecutionId",
  regularAuth,
  async (req: Request, res: Response) => {
    const { workoutExecutionId } = req.params;
    try {
      if (!workoutExecutionId) {
        return res.status(BAD_REQUEST).json({
          error: "No workout id!"
        });
      }

      const result = await getWorkoutExecutionById(workoutExecutionId);

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
  }
);

/******************************************************************************
 *                       Add One - "POST /api/execution/workout"
 ******************************************************************************/
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

/******************************************************************************
 *                       Update - "PUT /api/execution/move/{moveExecutionId}"
 ******************************************************************************/
/** @swagger
 *
 * /api/execution/move/{moveExecutionId}:
 *   put:
 *     tags: [MoveExecution]
 *     description: Update move execution
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: workoutExecutionId
 *         description: Id of the workout_execution entity
 *         required: true
 *         type: string
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
router.put(
  "/move/:moveExecutionId",
  regularAuth,
  async (req: Request, res: Response) => {
    const { moveExecutionId } = req.params;
    if (!moveExecutionId) {
      return res.status(BAD_REQUEST).json({
        error: "No moveExecutionId!"
      });
    }

    try {
      const { value, error } = validate(
        {
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

      const result = await updateMoveExecutionById(moveExecutionId, value);

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
  }
);

/******************************************************************************
 *         Delete one - "DELETE /api/execution/move/{workoutExecutionId}"
 ******************************************************************************/
router.delete(
  "/move/:moveExecutionId",
  regularAuth,
  async (req: Request, res: Response) => {
    const { moveExecutionId } = req.params;
    try {
      if (!moveExecutionId) {
        return res.status(BAD_REQUEST).json({
          error: "No moveExecutionId!"
        });
      }

      const result = await deleteMoveExecutionById(moveExecutionId);

      return res
        .status(NO_CONTENT)
        .json(result)
        .end();
    } catch (err) {
      logger.error(err.message, err);
      return res.status(BAD_REQUEST).json({
        error: err.message
      });
    }
  }
);

export default router;
