import { faker } from "@faker-js/faker";
import express, { Request, Response } from "express";
import { db } from "../db";
import { Customer } from "../types";
import { createCustomerAndRelationalData } from "../data/generators";

const router = express.Router();

function validateCustomerPayload(body: any) {
  const { name, email, phone, dateOfBirth, nationalId, address } = body;

  const errors: { field: string; message: string }[] = [];

  if (!name) errors.push({ field: "name", message: "Name is required" });
  if (!email) errors.push({ field: "email", message: "Email is required" });
  if (!phone) errors.push({ field: "phone", message: "Phone is required" });

  if (!dateOfBirth)
    errors.push({ field: "dateOfBirth", message: "Date of birth is required" });
  if (!nationalId)
    errors.push({ field: "nationalId", message: "National ID is required" });

  if (!address) {
    errors.push({ field: "address", message: "Address is required" });
  } else {
    if (!address.country)
      errors.push({ field: "address.country", message: "Country is required" });
    if (!address.city)
      errors.push({ field: "address.city", message: "City is required" });
    if (!address.postalCode)
      errors.push({
        field: "address.postalCode",
        message: "Postal code is required",
      });
    if (!address.line1)
      errors.push({
        field: "address.line1",
        message: "Address line1 is required",
      });
  }

  return errors;
}

/**
 * @openapi
 * /api/customers:
 *   get:
 *     summary: List customers with filters
 *     tags:
 *       - Customers
 *     parameters:
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
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name, email, phone, walletNumber, nationalId
 *       - in: query
 *         name: kycStatus
 *         schema:
 *           type: string
 *           enum: [UNKNOWN, UNVERIFIED, VERIFIED, CONTRACTED]
 *         description: Filter by KYC status
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: Paginated list of customers
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
 *                     $ref: "#/components/schemas/Customer"
 */
router.get("/", (req: Request, res: Response) => {
  const page = parseInt((req.query.page as string) || "1", 10);
  const pageSize = parseInt((req.query.pageSize as string) || "10", 10);

  const search = (req.query.search as string | undefined)?.toLowerCase();
  const kycStatus = req.query.kycStatus as
    | "UNKNOWN"
    | "UNVERIFIED"
    | "VERIFIED"
    | "CONTRACTED"
    | undefined;
  // const accountStatus = req.query.accountStatus as
  //   | "ACTIVE"
  //   | "SUSPENDED"
  //   | "CLOSED"
  //   | undefined;

  let list = db.customers;

  if (search) {
    list = list.filter((c) => {
      return (
        c.name.toLowerCase().includes(search) ||
        c.email.toLowerCase().includes(search) ||
        c.phone.toLowerCase().includes(search) ||
        c.nationalId.toString().includes(search)
      );
    });
  }

  if (kycStatus) {
    list = list.filter((c) => c.kycStatus === kycStatus);
  }

  if (req.query.isActive !== undefined) {
    const isActive = req.query.isActive === "true";
    list = list.filter((c) => c.isActive === isActive);
  }

  // if (accountStatus) {
  //   list = list.filter((c) => c.accountStatus === accountStatus);
  // }

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

/**
 * @openapi
 * /api/customers/{id}:
 *   get:
 *     summary: Get customer by ID
 *     tags:
 *       - Customers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Customer"
 *       404:
 *         description: Customer not found
 */
router.get("/:id", (req: Request, res: Response) => {
  const customer = db.customers.find((c) => c.id === req.params.id);
  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }
  res.json(customer);
});

/**
 * @openapi
 * /api/customers:
 *   post:
 *     summary: Create customer
 *     tags:
 *       - Customers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - dateOfBirth
 *               - nationalId
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               nationalId:
 *                 type: number
 *               address:
 *                 type: object
 *                 properties:
 *                   country:
 *                     type: string
 *                   city:
 *                     type: string
 *                   postalCode:
 *                     type: string
 *                   line1:
 *                     type: string
 *     responses:
 *       200:
 *         description: Customer Create
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Customer"
 *       201:
 *         description: Customer created
 *       400:
 *         description: Validation error
 */
router.post("/", (req: Request, res: Response) => {
  const errors = validateCustomerPayload(req.body);

  if (errors.length > 0) {
    return res.status(400).json({
      message: "Validation error",
      errors,
    });
  }

  const now = new Date().toISOString();

  const newCustomer: Customer = {
    id: faker.string.uuid(),
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    dateOfBirth: req.body.dateOfBirth,
    nationalId: req.body.nationalId,
    address: req.body.address,
    kycStatus: "UNKNOWN",
    // accountStatus: "ACTIVE",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };

  createCustomerAndRelationalData(newCustomer);

  res.status(201).json(newCustomer);
});

/**
 * @openapi
 * /api/customers/{id}:
 *   put:
 *     summary: Update customer
 *     tags:
 *       - Customers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdateCustomer"
 *     responses:
 *       200:
 *         description: Customer Updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Customer"
 *       400:
 *         description: Validation error
 *       404:
 *         description: Customer not found
 */
router.put("/:id", (req: Request, res: Response) => {
  const existingIndex = db.customers.findIndex((c) => c.id === req.params.id);

  if (existingIndex === -1) {
    return res.status(404).json({ message: "Customer not found" });
  }

  const errors = validateCustomerPayload(req.body);

  if (errors.length > 0) {
    return res.status(400).json({
      message: "Validation error",
      errors,
    });
  }

  const existing = db.customers[existingIndex];
  const now = new Date().toISOString();

  const updated: Customer = {
    ...existing,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    dateOfBirth: req.body.dateOfBirth,
    nationalId: req.body.nationalId,
    address: req.body.address,
    kycStatus: req.body.kycStatus ?? existing.kycStatus,
    // accountStatus: req.body.accountStatus ?? existing.accountStatus,
    isActive: req.body.isActive ?? existing.isActive,
    updatedAt: now,
  };

  db.customers[existingIndex] = updated;

  res.json(updated);
});

/**
 * @openapi
 * /api/customers/{id}:
 *   delete:
 *     summary: Delete customer
 *     tags:
 *       - Customers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Customer deleted
 *       404:
 *         description: Customer not found
 */
router.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  const customerIndex = db.customers.findIndex((c) => c.id === id);
  if (customerIndex === -1) {
    return res.status(404).json({ message: "Customer not found" });
  }

  // Remove customer
  db.customers.splice(customerIndex, 1);

  // Optional: cascade delete related wallets & transactions
  db.wallets = db.wallets.filter((w) => w.customerId !== id);
  db.transactions = db.transactions.filter((t) => t.customerId !== id);

  // No content on success
  res.status(204).send();
});

export default router;
