import bcrypt from "bcryptjs";
import { Request, Response, Router } from "express";
import { BAD_REQUEST, OK, UNAUTHORIZED, CREATED } from "http-status-codes";

import { logger, jwtCookieProps, JwtService, pwdSaltRounds } from "../shared";
import { eng } from "../shared/messages";
import Joi from "@hapi/joi";
import { Role } from "../types/enums";
import { addUser, getUserByEmail } from "../services/userService";
import {
  validate,
  requiredFirstnameValidator,
  requiredLastnameValidator,
  requiredPasswordValidator,
  requiredEmailValidator
} from "../services/validate";

const router = Router();
const jwtService = new JwtService();

/******************************************************************************
 *                      Register User - "POST /api/auth/register"
 *****************************************************************************/
/** @swagger
 *
 * /register:
 *   post:
 *     tags: [Auth]
 *     description: Register to the application
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: firstname
 *         description: Username to use for login.
 *         required: true
 *         type: string
 *       - name: lastname
 *         description: Username to use for login.
 *         required: true
 *         type: string
 *       - name: email
 *         description: Username to use for login.
 *         required: true
 *         type: string
 *       - name: password
 *         description: Username to use for login.
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: login
 */
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { value: user, error } = validate(
      {
        ...requiredFirstnameValidator,
        ...requiredLastnameValidator,
        ...requiredEmailValidator,
        ...requiredPasswordValidator
      },
      req.body
    );

    if (error) {
      return res.status(BAD_REQUEST).json({
        error: error.message
      });
    }

    // Is there user with this email?
    const existingUser = await getUserByEmail(user.email);
    if (existingUser) {
      return res.status(BAD_REQUEST).json({
        error: "Email already in use!"
      });
    }

    // Create hash
    const passwordHash = bcrypt.hashSync(user.password, pwdSaltRounds);

    await addUser({ ...user, passwordHash, role: Role.Regular });

    return res.status(CREATED).end();
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      Login User - "POST /api/auth/login"
 ******************************************************************************
 * @swagger
 *
 * /login:
 *
 *   post:
 *     tags: [Auth]
 *     description: Login to the application
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: username
 *         description: Username to use for login.
 *         required: true
 *         type: string
 *       - name: password
 *         description: User's password.
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: login
 */

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { value, error } = validate(
      {
        ...requiredEmailValidator,
        ...requiredPasswordValidator
      },
      req.body
    );

    if (error) {
      return res.status(BAD_REQUEST).json({
        error: error.message
      });
    }

    // Check email and password present
    const { email, password } = value;

    // Fetch user
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(UNAUTHORIZED).json({
        error: eng.loginFailedErr
      });
    }

    // Check password
    const pwdPassed = await bcrypt.compare(password, user.passwordHash);
    if (!pwdPassed) {
      return res.status(UNAUTHORIZED).json({
        error: eng.loginFailedErr
      });
    }
    const { id, role } = user;
    // Setup Admin Cookie
    const jwt = await jwtService.getJwt({
      userId: id,
      role
    });
    const { key, options } = jwtCookieProps;
    res.cookie(key, jwt, options);

    return res.status(OK).end();
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      Logout - "GET /api/auth/logout"
 ******************************************************************************/

router.get("/logout", async (req: Request, res: Response) => {
  try {
    const { key, options } = jwtCookieProps;
    res.clearCookie(key, options);
    return res.status(OK).end();
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                                 Export Router
 ******************************************************************************/

export default router;
