import { Request, Response, Router } from "express";
import { BAD_REQUEST, CREATED, OK, NO_CONTENT } from "http-status-codes";
import { logger, adminAuth, pwdSaltRounds, regularAuth } from "../shared";
import { Role } from "../types/enums";
import { addUser, getUserById } from "../services/userService";
import Joi from "@hapi/joi";
import bcrypt from "bcryptjs";

// Init shared
const router = Router();

/******************************************************************************
 *                      Get me GET /api/users/me
 ******************************************************************************/
router.get("/me", regularAuth, async (req: Request, res: Response) => {
  const { userId } = res.locals;

  try {
    const user = await getUserById(userId);

    if (!user) {
      return res
        .status(NO_CONTENT)
        .json({})
        .end();
    }

    return res
      .status(OK)
      .json(user)
      .end();
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      Get All Users - "GET /api/users/all"
 ******************************************************************************/

router.get("/all", adminAuth, async (req: Request, res: Response) => {});

/******************************************************************************
 *                       Add One - "POST /api/users/add"
 ******************************************************************************/

router.post("/add", adminAuth, async (req: Request, res: Response) => {});

/******************************************************************************
 *                       Update - "PUT /api/users/:id"
 ******************************************************************************/

router.put("/update", adminAuth, async (req: Request, res: Response) => {});

/******************************************************************************
 *                    Delete - "DELETE /api/users/:id"
 ******************************************************************************/

router.delete("/:id", adminAuth, async (req: Request, res: Response) => {});

/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
