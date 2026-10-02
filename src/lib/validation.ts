import { z } from "zod";
import { indiaStatePaths } from "./india-map-data";

/** The 36 states & union territories ReliefChain operates in. */
export const INDIA_STATES = indiaStatePaths.map((s) => s.name);

/** Indian mobile numbers: optional +91, then 10 digits starting 6-9. */
export const indianMobile = /^(\+91[-\s]?)?[6-9](\s?\d){9}$/;

/** Bot-timing field: seconds since the form mounted (rejects instant submits). */
export const submittedAtField = z.coerce.number().optional();

export const orgRegistrationSchema = z.object({
  // Honeypot — hidden from real users; bots fill every field.
  website: z.string().max(0, "Bot detected"),
  submittedAt: submittedAtField,
  orgName: z.string().min(3, "Organisation name is too short").max(120),
  kind: z.enum(["NGO", "PWD Company", "Government Body", "Volunteer Group"]),
  contactName: z.string().min(2, "Contact person name is required").max(120),
  email: z.email("Enter a valid email address"),
  phone: z
    .string()
    .regex(indianMobile, "Enter a valid Indian mobile number, e.g. 98765 43210"),
  region: z
    .string()
    .refine(
      (v) => INDIA_STATES.includes(v.trim()),
      "Select a state or union territory",
    ),
  regNumber: z.string().min(4, "Registration number is required").max(60),
  focus: z.string().min(10, "Describe your focus area (min 10 chars)").max(400),
  // Verification documents — links / ids checked by a human reviewer.
  certUrl: z
    .string()
    .max(500)
    .optional()
    .refine(
      (v) => !v || v === "" || /^https?:\/\/.+\..+/.test(v),
      "Enter a valid document link (https://…)"
    ),
  pan: z.string().max(20).optional(),
  idProof: z.string().max(120).optional(),
});

export const contactSchema = z.object({
  website: z.string().max(0, "Bot detected"),
  submittedAt: submittedAtField,
  name: z.string().min(2, "Name is required").max(120),
  email: z.email("Enter a valid email address"),
  subject: z.string().min(4, "Subject is required").max(160),
  message: z.string().min(20, "Message must be at least 20 characters").max(2000),
});

export const donationSchema = z.object({
  website: z.string().max(0, "Bot detected"),
  submittedAt: submittedAtField,
  name: z.string().min(2, "Your name is required").max(120),
  amount: z.coerce.number().int().min(100, "Minimum donation is ₹100").max(10000000),
  email: z.email("Enter a valid email for your receipt"),
  disasterId: z.string().min(1, "Choose a disaster to support"),
});

export const tenderClaimSchema = z.object({
  website: z.string().max(0, "Bot detected"),
  submittedAt: submittedAtField,
  tenderId: z.string().min(1, "Choose a tender"),
  orgName: z.string().min(3, "Organisation name is too short").max(120),
  email: z.email("Enter a valid work email"),
});

export const signupSchema = z.object({
  fullName: z.string().min(2, "Full name is required").max(120),
  email: z.email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Use at least 8 characters")
    .max(72, "Password is too long"),
  // India-only service: national mobile format (optionally with +91)
  phone: z
    .string()
    .regex(indianMobile, "Enter a valid Indian mobile number, e.g. 98765 43210"),
});

export type OrgRegistrationInput = z.infer<typeof orgRegistrationSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type DonationInput = z.infer<typeof donationSchema>;
export type TenderClaimInput = z.infer<typeof tenderClaimSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
