export interface Address {
  country: string;
  city: string;
  postalCode: string;
  line1: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  nationalId: number;
  address: Address;
  dateOfBirth: string; // ISO format: YYYY-MM-DD
  kycStatus: "UNKNOWN" | "UNVERIFIED" | "VERIFIED" | "CONTRACTED";
  // accountStatus: "ACTIVE" | "SUSPENDED" | "CLOSED";
  isActive: boolean;
  createdAt: string; // ISO format: YYYY-MM-DD
  updatedAt: string; // ISO format: YYYY-MM-DD
}

export interface Wallet {
  customerId: string;
  currency: string;
  balance: number;
  dailyLimit: number;
  monthlyLimit: number;
}

export interface Transaction {
  id: string;
  customerId: string;
  type: "DEBIT" | "CREDIT";
  amount: number;
  currency: string;
  createdAt: string;
  description: string;
  transferDirection: "INCOMING" | "OUTGOING";
  merchantName?: string; // for POS / merchant payments
  receiverName?: string; // for P2P transfers
  receiverWalletNumber?: string; // for P2P transfers
}
