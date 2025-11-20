// import { Router } from "express";
// import { initDb } from "../data/generators";
// import { db } from "../db";

// const router = Router();

// /**
//  * @openapi
//  * /api/reset:
//  *   post:
//  *     summary: Reset in-memory database
//  *     tags:
//  *       - Reset
//  *     responses:
//  *       200:
//  *         description: Database reset successfully
//  */
// router.post("/reset", (_req, res) => {
//   initDb();

//   res.json({
//     message: "Database Reset",
//     stats: {
//       customers: db.customers.length,
//       wallets: db.wallets.length,
//       transactions: db.transactions.length,
//     },
//   });
// });

// export default router;
