import { Request, Response, Router } from "express";
import { BAD_REQUEST, CREATED, OK } from "http-status-codes";
import { logger, adminAuth, pwdSaltRounds } from "../shared";
import { Role } from "../types/enums";
import { addUser } from "../services/userService";
import Joi from "@hapi/joi";
import bcrypt from "bcryptjs";

// Init shared
const router = Router();

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
