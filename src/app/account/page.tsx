import type { Metadata } from "next";
import { AlertTicker } from "@/components/alert-ticker";
import { AccountZone } from "@/components/account-zone";

export const metadata: Metadata = {
  title: "My account",
  description:
    "Your ReliefChain account — profile, sign out, and quick links to register, dashboard, tenders, donations and study.",
};

export default function AccountPage() {
  return (
    <>
      <AlertTicker />
      <AccountZone />
    </>
  );
}
