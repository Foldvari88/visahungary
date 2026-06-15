import type { LeadRecord } from "@/lib/types";

const globalForLeads = globalThis as unknown as {
  visaHungaryLeads?: Map<string, LeadRecord>;
};

const leads = globalForLeads.visaHungaryLeads ?? new Map<string, LeadRecord>();
globalForLeads.visaHungaryLeads = leads;

export function createLead(record: LeadRecord) {
  leads.set(record.leadToken, record);
  return record;
}

export function getLead(leadToken: string) {
  return leads.get(leadToken) ?? null;
}

export function updateLead(leadToken: string, updater: (lead: LeadRecord) => LeadRecord) {
  const lead = getLead(leadToken);
  if (!lead) return null;
  const next = updater(lead);
  leads.set(leadToken, next);
  return next;
}
