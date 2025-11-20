import { Customer, Wallet, Transaction } from "./types";

export interface Db {
  customers: Customer[];
  wallets: Wallet[];
  transactions: Transaction[];
}

export const db: Db = {
  customers: [],
  wallets: [],
  transactions: [],
};
