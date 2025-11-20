import { faker } from "@faker-js/faker";
import { Customer, Wallet, Transaction } from "../types";
import { db } from "../db";

export function generateCustomers(count: number): Customer[] {
  const created = faker.date.past({ years: 1 });
  const updated = faker.date.recent({ days: 30 });

  return Array.from({ length: count }).map(() => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number({ style: "international" }),
    walletNumber: faker.finance.accountNumber(16),
    // nationalId: faker.string.numeric({ length: 11, allowLeadingZeros: false }),
    nationalId: Number(
      faker.string.numeric({ length: 11, allowLeadingZeros: false })
    ),
    dateOfBirth: faker.date
      .birthdate({ min: 18, max: 100, mode: "age" })
      .toISOString()
      .split("T")[0],
    address: {
      country: faker.location.country(),
      city: faker.location.city(),
      postalCode: faker.location.zipCode(),
      line1: faker.location.streetAddress(),
    },
    kycStatus: faker.helpers.arrayElement([
      "UNKNOWN",
      "UNVERIFIED",
      "VERIFIED",
      "CONTRACTED",
    ]),
    // accountStatus: faker.helpers.arrayElement([
    //   "ACTIVE",
    //   "SUSPENDED",
    //   "CLOSED",
    // ]),
    isActive: faker.datatype.boolean(),
    createdAt: created.toISOString().split("T")[0],
    updatedAt: updated.toISOString().split("T")[0],
  }));
}

export function createCustomerAndRelationalData(customer: Customer) {
  db.customers.push(customer);
  const wallet = generateWallets([customer]);
  const transactions = generateTransactions([customer]);

  db.wallets.push(...wallet);
  db.transactions.push(...transactions);
}

export function generateWallets(customers: Customer[]): Wallet[] {
  return customers.map((c) => ({
    customerId: c.id,
    currency: faker.helpers.arrayElement(["TRY", "USD", "EUR"]),
    balance: faker.number.float({ min: 0, max: 100_000, fractionDigits: 2 }),
    dailyLimit: faker.number.int({ min: 1_000, max: 50_000 }),
    monthlyLimit: faker.number.int({ min: 20_000, max: 500_000 }),
  }));
}

export function generateTransactions(
  customers: Customer[],
  min = 20,
  max = 30
): Transaction[] {
  const all: Transaction[] = [];

  customers.forEach((customer) => {
    // Random count between min–max
    const count = faker.number.int({ min, max });

    const customerTx = Array.from({ length: count }).map(() => {
      const type = faker.helpers.arrayElement<"DEBIT" | "CREDIT">([
        "DEBIT",
        "CREDIT",
      ]);

      const transferDirection = type === "CREDIT" ? "INCOMING" : "OUTGOING";

      const isMerchantPayment = faker.datatype.boolean();

      const merchantName = isMerchantPayment ? faker.company.name() : undefined;

      const receiverName =
        !isMerchantPayment && transferDirection === "OUTGOING"
          ? faker.person.fullName()
          : undefined;

      const receiverWalletNumber = receiverName
        ? faker.finance.accountNumber(16)
        : undefined;

      return {
        id: faker.string.uuid(),
        customerId: customer.id,
        type,
        amount: faker.number.float({ min: 5, max: 5000, fractionDigits: 2 }),
        currency: faker.helpers.arrayElement(["TRY", "USD", "EUR"]),
        createdAt: faker.date.recent({ days: 30 }).toISOString(),
        description: faker.finance.transactionDescription(),

        transferDirection,
        merchantName,
        receiverName,
        receiverWalletNumber,
      } as Transaction;
    });

    all.push(...customerTx);
  });

  return all;
}

/**
 * Initialize / reset the in-memory DB with fresh mock data.
 * Call this once at startup (or expose a dev-only endpoint to reseed).
 */
export function initDb() {
  const customers = generateCustomers(50);
  const wallets = generateWallets(customers);
  const transactions = generateTransactions(customers);

  db.customers = customers;
  db.wallets = wallets;
  db.transactions = transactions;
}
