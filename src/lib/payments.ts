import type { PaymentMethod } from "@/lib/validation";

export type PaymentMeta = {
  id: PaymentMethod;
  label: string;
  hint: string;
  demo: boolean;
  refLabel: string;
  refPlaceholder: string;
};

export const PAYMENT_METHODS: PaymentMeta[] = [
  {
    id: "upi",
    label: "UPI",
    hint: "GPay / PhonePe / Paytm · instant",
    demo: false,
    refLabel: "Your UPI ID",
    refPlaceholder: "name@okhdfcbank",
  },
  {
    id: "card",
    label: "Card",
    hint: "Visa / Mastercard / RuPay",
    demo: false,
    refLabel: "Card (demo — last 4 only)",
    refPlaceholder: "e.g. 4242",
  },
  {
    id: "razorpay",
    label: "Razorpay",
    hint: "Cards, UPI, netbanking via Razorpay",
    demo: true,
    refLabel: "Razorpay order note (demo)",
    refPlaceholder: "order_demo_… (auto-filled)",
  },
  {
    id: "paypal",
    label: "PayPal",
    hint: "International donors",
    demo: true,
    refLabel: "PayPal email",
    refPlaceholder: "you@example.com",
  },
  {
    id: "crypto",
    label: "Crypto",
    hint: "BTC / ETH / USDT · on-chain",
    demo: true,
    refLabel: "Network + tx hint",
    refPlaceholder: "e.g. Polygon · 0x…",
  },
];

export function isDemoMethod(m: PaymentMethod): boolean {
  return PAYMENT_METHODS.find((p) => p.id === m)?.demo ?? true;
}

/** Fake processing timeline shown at checkout (no real money moves). */
export function demoStepsFor(method: PaymentMethod): string[] {
  switch (method) {
    case "razorpay":
      return ["Opening Razorpay demo checkout…", "Confirming test payment…", "Locking escrow…"];
    case "paypal":
      return ["Redirecting to PayPal sandbox…", "Confirming sandbox approval…", "Locking escrow…"];
    case "crypto":
      return ["Waiting for wallet signature (demo)…", "Confirming on testnet…", "Locking escrow…"];
    case "upi":
      return ["Sending UPI collect request (demo)…", "Confirming payment…", "Locking escrow…"];
    case "card":
      return ["Tokenising card (demo)…", "Confirming payment…", "Locking escrow…"];
  }
}
