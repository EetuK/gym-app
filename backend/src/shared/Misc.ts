import { Request, Response, NextFunction } from "express";
import { UNAUTHORIZED } from "http-status-codes";
import { logger } from "./Logger";
import { jwtCookieProps } from "./cookies";
import { JwtService } from "./JwtService";
import { Role } from "../types/enums";

// Init shared
const jwtService = new JwtService();

// Numbers
export const pwdSaltRounds = 12;

/* Functions */

export const pErr = (err: Error) => {
  if (err) {
    logger.error(err);
  }
};

export const getRandomInt = () => {
  return Math.floor(Math.random() * 1_000_000_000_000);
};

// Middleware to verify if user is an admin
export const adminAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get json-web-token
    const jwt = req.signedCookies[jwtCookieProps.key];
    //const jwt = req.headers["authorization"];
    if (!jwt) {
      throw Error("JWT not present in signed cookie.");
    }
    // Make sure user role is an admin
    const { userId, role } = await jwtService.decodeJwt(jwt);
    if (role === Role.Admin || role === Role.SuperAdmin) {
      res.locals.user.userId = userId;
      next();
    } else {
      throw Error("JWT not present in signed cookie.");
    }
  } catch (err) {
    return res.status(UNAUTHORIZED).json({
      error: err.message
    });
  }
};

// Middleware to verify that user has at least normal user rights
export const regularAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get json-web-token
    const jwt = req.signedCookies[jwtCookieProps.key];
    //const jwt = req.headers["authorization"];
    if (!jwt) {
      throw Error("JWT not present in signed cookie.");
    }
    // Make sure user role is an admin
    const { userId, role } = await jwtService.decodeJwt(jwt);
    if (
      role === Role.Admin ||
      role === Role.SuperAdmin ||
      role === Role.Regular
    ) {
      res.locals.userId = userId;
      next();
    } else {
      throw Error("JWT not present in signed cookie.");
    }
  } catch (err) {
    return res.status(UNAUTHORIZED).json({
      error: err.message
    });
  }
};
