import express, { Request, Response } from "express";
import { db } from "../db";

const router = express.Router();

/**
 * @openapi
 * /api/wallets/{customerId}:
 *   get:
 *     summary: Get wallet by customerId
 *     tags:
 *       - Wallets
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Wallet"
 *       404:
 *         description: Wallet not found
 */
router.get("/:customerId", (req: Request, res: Response) => {
  const wallet = db.wallets.find((w) => w.customerId === req.params.customerId);
  if (!wallet) {
    return res.status(404).json({ message: "Wallet not found" });
  }
  res.json(wallet);
});

/**
 * @openapi
 * /api/wallets/{customerId}:
 *   patch:
 *     summary: Update wallet limits
 *     tags:
 *       - Wallets
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dailyLimit:
 *                 type: number
 *               monthlyLimit:
 *                 type: number
 *     responses:
 *       200:
 *         description: Customer details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Wallet"
 *       400:
 *         description: Validation error
 *       404:
 *         description: Wallet not found
 */
router.patch("/:customerId", (req: Request, res: Response) => {
  const wallet = db.wallets.find((w) => w.customerId === req.params.customerId);
  if (!wallet) {
    return res.status(404).json({ message: "Wallet not found" });
  }

  const { dailyLimit, monthlyLimit } = req.body;

  if (
    (dailyLimit !== undefined && dailyLimit < 0) ||
    (monthlyLimit !== undefined && monthlyLimit < 0)
  ) {
    return res.status(400).json({
      message: "Validation error",
      errors: [
        dailyLimit !== undefined &&
          dailyLimit < 0 && {
            field: "dailyLimit",
            message: "Must be >= 0",
          },
        monthlyLimit !== undefined &&
          monthlyLimit < 0 && {
            field: "monthlyLimit",
            message: "Must be >= 0",
          },
      ].filter(Boolean),
    });
  }

  if (dailyLimit !== undefined) wallet.dailyLimit = dailyLimit;
  if (monthlyLimit !== undefined) wallet.monthlyLimit = monthlyLimit;

  res.json(wallet);
});

export default router;
