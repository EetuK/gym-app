import { Request, Response, Router } from "express";
import { BAD_REQUEST, CREATED, OK, NO_CONTENT } from "http-status-codes";
import { logger, adminAuth, regularAuth } from "../shared";
import {
  validate,
  requiredNameValidator,
  requiredInfoValidator,
  requiredMoveIdValidator
} from "../services/validate";
import { getUserByEmail } from "../services/userService";
import {
  createMove,
  getMovesByUserId,
  deleteMove,
  getMoveById
} from "../services/moveService";
import { isUndefined } from "util";

// Init shared
const router = Router();

/******************************************************************************
 *                      Get All user moves - "GET /api/move"
 ******************************************************************************/
/** @swagger
 *
 * /api/move:
 *   get:
 *     tags: [Move]
 *     description: Get all user moves
 *     produces:
 *       - application/json
 */
router.get("/", regularAuth, async (req: Request, res: Response) => {
  const { userId } = res.locals;

  try {
    const moves = await getMovesByUserId(userId);

    if (isUndefined(moves)) {
      return res
        .status(NO_CONTENT)
        .json({})
        .end();
    }

    return res
      .status(OK)
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
 *                      Get One Move - "GET /api/move/:id"
 ******************************************************************************/
/** @swagger
 *
 * /api/move/{id}:
 *   get:
 *     tags: [Move]
 *     description: Get one Move
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *     responses:
 *       '200':
 *         description: Success
 */
router.get("/:id", regularAuth, async (req: Request, res: Response) => {
  const { userId } = res.locals;
  const { id } = req.params;

  try {
    const result = await getMoveById(userId, (id as unknown) as number);

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
 *                       Add One - "POST /api/move"
 ******************************************************************************/
/** @swagger
 *
 * /api/move:
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

/******************************************************************************
 *                       Delete One - "DELETE /api/move/{id}"
 ******************************************************************************/
/** @swagger
 *
 * /api/move/{id}:
 *   delete:
 *     tags: [Move]
 *     description: Delete a move
 *     produces:
 *       - application/json
 *     parameters:
 *       - id: id
 *         in: path
 *         description: ID of the move
 *         required: true
 *         type: string
 */
router.delete("/:id", regularAuth, async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await deleteMove((id as unknown) as number);

    return res.status(NO_CONTENT).end();
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

export default router;
