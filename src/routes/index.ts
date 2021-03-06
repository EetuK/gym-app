import { Router } from "express";
import UserRouter from "./Users";
import AuthRouter from "./Auth";
import WorkoutRouter from "./Workout";
import MoveRouter from "./Move";
import WorkoutMoveRouter from "./WorkoutMove";
import ExecutionRouter from "./Execution";

// Init router and path
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Login and register
 */
router.use("/auth", AuthRouter);

/**
 * @swagger
 * tags:
 *   name: Move
 *   description: Creating and getting moves
 */
router.use("/move", MoveRouter);

/**
 * @swagger
 * tags:
 *   name: Workout
 *   description: Creating and getting workouts
 */
router.use("/workout", WorkoutRouter);

/**
 * @swagger
 * tags:
 *   name: WorkoutMove
 *   description: Creating and getting WorkoutMoves
 */
router.use("/workoutmove", WorkoutMoveRouter);

/**
 * @swagger
 * tags:
 *   name: Execution
 *   description: Creating and getting Workout executions and Move executions
 */
router.use("/execution", ExecutionRouter);

router.use("/users", UserRouter);

// Export the base-router
export default router;
