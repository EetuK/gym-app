import { Request, Response, Router } from "express";
import { BAD_REQUEST, CREATED, OK } from "http-status-codes";
import { logger, adminAuth, regularAuth } from "../shared";
import {
  validate,
  requiredNameValidator,
  requiredInfoValidator
} from "../services/validate";
import { getUserByEmail } from "../services/userService";
import { createMove, getMovesByUserId } from "../services/moveService";

// Init shared
const router = Router();

/******************************************************************************
 *                      Get All user moves - "GET /api/move"
 ******************************************************************************/
/** @swagger
 *
 * /move:
 *   get:
 *     tags: [Move]
 *     description: Get all user moves
 *     produces:
 *       - application/json
 */
router.get("/", regularAuth, async (req: Request, res: Response) => {
  try {
    const { userId } = res.locals;

    const moves = await getMovesByUserId(userId);
    return res
      .status(CREATED)
      .json(moves)
      .end();
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                       Add One - "POST /api/move"
 ******************************************************************************/
/** @swagger
 *
 * /move:
 *   post:
 *     tags: [Move]
 *     description: Create new move
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: name
 *         description: Name of the move
 *         required: true
 *         type: string
 *       - name: info
 *         description: More info of the move
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
    const result = await createMove({ userId, name, info });

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
