import express, { Request, Response } from "express";
import { db } from "../db";

const router = express.Router();

/**
 * @openapi
 * /api/transactions/{customerId}:
 *   get:
 *     summary: List transactions by customerId
 *     tags:
 *       - Transactions
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number (starting from 1)
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Page size
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [DEBIT, CREDIT]
 *         description: Filter by transaction type
 *       - in: query
 *         name: transferDirection
 *         schema:
 *           type: string
 *           enum: [INCOMING, OUTGOING]
 *         description: Filter by transfer direction
 *       - in: query
 *         name: currency
 *         schema:
 *           type: string
 *         description: Filter by currency code
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter by createdAt >= from
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter by createdAt <= to
 *     responses:
 *       200:
 *         description: Paginated transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                 pageSize:
 *                   type: integer
 *                 total:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Transaction"
 */
router.get("/:customerId", (req: Request, res: Response) => {
  const customerId = req.params.customerId;

  const page = parseInt((req.query.page as string) || "1", 10);
  const pageSize = parseInt((req.query.pageSize as string) || "10", 10);

  const type = req.query.type as "DEBIT" | "CREDIT" | undefined;
  const transferDirection = req.query.transferDirection as
    | "INCOMING"
    | "OUTGOING"
    | undefined;
  const currency = req.query.currency as string | undefined;
  const from = req.query.from as string | undefined;
  const to = req.query.to as string | undefined;

  let list = db.transactions.filter((t) => t.customerId === customerId);

  if (type) {
    list = list.filter((t) => t.type === type);
  }

  if (transferDirection) {
    list = list.filter((t) => t.transferDirection === transferDirection);
  }

  if (currency) {
    list = list.filter((t) => t.currency === currency);
  }

  if (from) {
    const fromDate = new Date(from);
    if (!isNaN(fromDate.getTime())) {
      list = list.filter((t) => new Date(t.createdAt) >= fromDate);
    }
  }

  if (to) {
    const toDate = new Date(to);
    if (!isNaN(toDate.getTime())) {
      list = list.filter((t) => new Date(t.createdAt) <= toDate);
    }
  }

  const total = list.length;
  const start = (page - 1) * pageSize;
  const data = list.slice(start, start + pageSize);

  res.json({
    page,
    pageSize,
    total,
    data,
  });
});

export default router;
