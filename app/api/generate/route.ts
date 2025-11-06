import { NextRequest } from "next/server";
import { z } from "zod";
import { generateLeadPack, type LeadInput } from "@/lib/generator";

const schema = z.object({
  businessName: z.string().min(1),
  industry: z.string().min(1),
  product: z.string().min(1),
  audience: z.string().min(1),
  pains: z.string().default(""),
  differentiator: z.string().default(""),
  tone: z.string().default("clear and confident"),
  website: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  channels: z.array(z.string()).default(["email", "linkedin"]),
  primaryCta: z.string().default("Book a demo"),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = schema.parse(json) as LeadInput;
    const result = await generateLeadPack(parsed);
    return new Response(JSON.stringify(result), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    const message = err?.message || "Bad request";
    return new Response(message, { status: 400 });
  }
}
