import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "WalletGate API",
    version: "1.0.0",
    description: "API for the Frontend Developer Case Study",
  },
  servers: [
    {
      url: "/",
      description: "Base path (Render / local)",
    },
  ],
  components: {
    schemas: {
      Address: {
        type: "object",
        properties: {
          country: { type: "string", example: "Turkey" },
          city: { type: "string", example: "İstanbul" },
          postalCode: { type: "string", example: "34000" },
          line1: { type: "string", example: "Büyükdere Cd. No:123" },
        },
        required: ["country", "city", "postalCode", "line1"],
      },
      Customer: {
        type: "object",
        properties: {
          id: { type: "string", example: "c-1710761123123" },
          name: { type: "string", example: "Ahmet Yılmaz" },
          email: { type: "string", example: "ahmet@example.com" },
          phone: { type: "string", example: "+90 532 555 55 55" },
          walletNumber: {
            type: "string",
            example: "4829136582049172",
          },
          dateOfBirth: {
            type: "string",
            format: "date",
            example: "1985-04-12",
          },
          nationalId: {
            type: "number",
            example: 12345678901,
          },
          address: {
            $ref: "#/components/schemas/Address",
          },
          kycStatus: {
            type: "string",
            enum: ["UNKNOWN", "UNVERIFIED", "VERIFIED", "CONTRACTED"],
          },
          // accountStatus: {
          //   type: "string",
          //   enum: ["ACTIVE", "SUSPENDED", "CLOSED"],
          // },
          isActive: {
            type: "boolean",
            example: true,
          },
          createdAt: {
            type: "string",
            format: "date-time",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
          },
        },
      },
      UpdateCustomer: {
        type: "object",
        properties: {
          name: { type: "string", example: "Ahmet Yılmaz" },
          email: { type: "string", example: "ahmet@example.com" },
          phone: { type: "string", example: "+90 532 555 55 55" },
          dateOfBirth: {
            type: "string",
            format: "date",
            example: "1985-04-12",
          },
          nationalId: {
            type: "number",
            example: 12345678901,
          },
          address: {
            $ref: "#/components/schemas/Address",
          },
          kycStatus: {
            type: "string",
            enum: ["UNKNOWN", "UNVERIFIED", "VERIFIED", "CONTRACTED"],
          },
          isActive: {
            type: "boolean",
            example: true,
          },
        },
      },
      Transaction: {
        type: "object",
        properties: {
          id: { type: "string", example: "t-1710761188001" },
          customerId: {
            type: "string",
            example: "c-1710761123123",
          },
          type: {
            type: "string",
            enum: ["DEBIT", "CREDIT"],
          },
          amount: {
            type: "number",
            example: 129.9,
          },
          currency: {
            type: "string",
            example: "TRY",
          },
          createdAt: {
            type: "string",
            format: "date-time",
          },
          description: {
            type: "string",
            example: "POS payment at market",
          },
          transferDirection: {
            type: "string",
            enum: ["INCOMING", "OUTGOING"],
          },
          merchantName: {
            type: "string",
            nullable: true,
            example: "Migros Tic. A.Ş.",
          },
          receiverName: {
            type: "string",
            nullable: true,
            example: "Mehmet Kara",
          },
          receiverWalletNumber: {
            type: "string",
            nullable: true,
            example: "4893201982736451",
          },
        },
      },
      Wallet: {
        type: "object",
        properties: {
          customerId: { type: "string", example: "c-1710761123123" },
          currency: { type: "string", example: "TRY" },
          balance: { type: "number", example: 10500.75 },
          dailyLimit: { type: "number", example: 20000 },
          monthlyLimit: { type: "number", example: 500000 },
        },
      },
    },
  },
};

export const swaggerOptions: swaggerJSDoc.Options = {
  swaggerDefinition,
  apis: ["./src/routes/*.ts"],
};
