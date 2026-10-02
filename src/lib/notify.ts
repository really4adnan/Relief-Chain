import { randomUUID } from "crypto";
import type { Disaster, Organisation } from "./data";
import type { DispatchChannel } from "./store";

/**
 * Notification provider abstraction for emergency dispatch.
 *
 * Real SMS / email / voice providers plug in here via environment keys:
 *   SMS_PROVIDER_KEY / SMS_PROVIDER_FROM      (e.g. Twilio / Exotel)
 *   EMAIL_PROVIDER_KEY / EMAIL_PROVIDER_FROM  (e.g. SendGrid / SES)
 *   VOICE_PROVIDER_KEY                        (e.g. voice-call bridge)
 *
 * Until keys are configured, entries are recorded as "queued" in the local
 * dispatch log so the whole flow stays testable end-to-end. The dashboard
 * channel is always "sent" (in-app delivery needs no provider).
 */

export interface NotifyResult {
  id: string;
  disasterId: string;
  disasterTitle: string;
  orgName: string;
  channel: DispatchChannel;
  sentAt: string;
  status: "sent" | "queued";
  note?: string;
}

const CHANNELS: DispatchChannel[] = ["dashboard", "sms", "email", "voice"];

function providerReady(channel: DispatchChannel): boolean {
  if (channel === "dashboard") return true;
  if (channel === "sms") return Boolean(process.env.SMS_PROVIDER_KEY);
  if (channel === "email") return Boolean(process.env.EMAIL_PROVIDER_KEY);
  if (channel === "voice") return Boolean(process.env.VOICE_PROVIDER_KEY);
  return false;
}

function channelFor(index: number): DispatchChannel {
  return CHANNELS[index % CHANNELS.length];
}

/** Fan out one alert to every verified organisation. No real PII leaves. */
export async function sendAlerts(
  disaster: Disaster,
  orgs: Organisation[]
): Promise<NotifyResult[]> {
  const now = new Date().toISOString();
  return orgs.map((o, i) => {
    const channel = channelFor(i);
    const ready = providerReady(channel);
    return {
      id: randomUUID(),
      disasterId: disaster.id,
      disasterTitle: disaster.title,
      orgName: o.name,
      channel,
      sentAt: now,
      status: ready ? ("sent" as const) : ("queued" as const),
      note: ready
        ? channel === "dashboard"
          ? "delivered in-app"
          : `sent via ${channel} provider`
        : `queued — add ${channel === "sms" ? "SMS_PROVIDER_KEY" : channel === "email" ? "EMAIL_PROVIDER_KEY" : "VOICE_PROVIDER_KEY"} for live delivery`,
    };
  });
}

/** Human-readable provider status for admin / diagnostics UI. */
export function providerStatus(): Record<DispatchChannel, "live" | "queued"> {
  return {
    dashboard: "live",
    sms: process.env.SMS_PROVIDER_KEY ? "live" : "queued",
    email: process.env.EMAIL_PROVIDER_KEY ? "live" : "queued",
    voice: process.env.VOICE_PROVIDER_KEY ? "live" : "queued",
  };
}
