import { getAllContacts } from "@/lib/repo";
import { backendInfo } from "@/lib/repo";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const contacts = await getAllContacts();
  const info = backendInfo();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
        <h1 className="text-xl font-semibold text-slate-ink">Contact messages</h1>
        <span className="font-mono text-[11px] text-slate-body">
          {contacts.items.length} messages · source: {info.label}
        </span>
      </div>

      <ul className="space-y-3">
        {contacts.items.map((m) => (
          <li key={m.id} className="border border-line bg-surface p-4">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-medium text-slate-ink">{m.name}</span>
              <a
                href={`mailto:${m.email}`}
                className="font-mono text-xs text-teal-brand hover:underline"
              >
                {m.email}
              </a>
              <span className="ml-auto font-mono text-[11px] text-slate-body">
                {new Date(m.createdAt).toLocaleString("en-IN")}
              </span>
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-ink">{m.subject}</p>
            <p className="mt-1 whitespace-pre-wrap text-sm leading-6">{m.message}</p>
          </li>
        ))}
        {contacts.items.length === 0 && (
          <li className="border border-dashed border-line bg-surface p-8 text-center text-sm text-slate-body">
            No messages yet — ones sent from /contact will land here.
          </li>
        )}
      </ul>
    </div>
  );
}
