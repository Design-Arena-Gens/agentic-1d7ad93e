import OpenAI from "openai";

export type LeadInput = {
  businessName: string;
  industry: string;
  product: string;
  audience: string;
  pains: string;
  differentiator: string;
  tone: string;
  website?: string;
  location?: string;
  channels: string[];
  primaryCta: string;
};

export type LeadResult = {
  icp: string;
  persona: string;
  valueProp: string;
  elevator: string;
  ctas: string[];
  emailSequence: string[];
  linkedinDm: string;
  landing: { headline: string; subheadline: string; bullets: string[]; socialProof: string; cta: string };
  faq: { q: string; a: string }[];
  seoKeywords: string[];
  contentIdeas: string[];
  snippets: string[];
};

function toList(s: string): string[] {
  return s
    .split(/[,\n]/)
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, 8);
}

function sentenceCase(s: string) {
  if (!s) return s;
  const t = s.trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function fallbackGenerate(input: LeadInput): LeadResult {
  const pains = toList(input.pains);
  const tone = input.tone || "clear and confident";
  const product = input.product || "your product";
  const business = input.businessName || "Your company";
  const audience = input.audience || "your buyers";
  const diff = input.differentiator || "faster, easier, more affordable";
  const primaryCta = input.primaryCta || "Book a demo";
  const industry = input.industry || "your industry";

  const icp = `${sentenceCase(audience)} in ${input.location || "your target markets"} who struggle with ${pains.slice(0,3).join(", ") || "costly manual work"} and have budget/authority to adopt ${product}.`;

  const persona = [
    `Role: Decision-maker evaluating ${product} in ${industry}`,
    `Goals: Eliminate ${pains[0] || "waste"}, hit targets, reduce risk`,
    `Frustrations: ${pains.join(", ") || "slow, error-prone workflows"}`,
    `Buying triggers: new KPIs, headcount freeze, tool consolidation`,
    `Objections: switching cost, security, onboarding time`,
  ].join("\n");

  const valueProp = `${business} helps ${audience} ${pains[0] ? `eliminate ${pains[0]}` : "ship faster"} by delivering ${diff}. Unlike alternatives, we combine ${industry} best-practices with modern automation to create measurable impact in weeks, not months.`;

  const elevator = `${product} for ${audience}: ${diff}. ${business} reduces ${pains[0] || "manual work"} by up to 70% in the first 90 days. ${primaryCta}.`;

  const ctas = [
    primaryCta,
    "Get pricing",
    "See a live demo",
    "Start free trial",
    "Download the ROI one-pager",
  ];

  const email1 = `Subject: ${audience} ? quick idea on ${pains[0] || "efficiency"}
Hi {{first_name}},
Noticed ${audience} often battle ${pains[0] || "manual busywork"}. ${business} helps teams like yours ${diff} with ${product}.
Worth 15 mins to see if this could save ${industry} teams 5-10 hrs/week? ${primaryCta}.`;
  const email2 = `Subject: Re: ${product} x ${audience}
Hi {{first_name}}, circling back with a quick example: teams switched from ${pains[1] || "spreadsheets"} and saw results in <30 days.
If timing is off, happy to send a 2-min overview. Otherwise, ${primaryCta}.`;
  const email3 = `Subject: Close the loop?
Last note, {{first_name}} ? if ${pains[0] || "manual work"} and ${pains[1] || "slow reviews"} are still a drag, I can share a short ROI model tailored to ${audience}. ${primaryCta}.`;

  const linkedinDm = `Hey {{first_name}} ? noticed you're leading ${industry} initiatives. Many ${audience} mention ${pains[0] || "manual work"}. We built ${product} to ${diff}. Open to a quick walkthrough?`;

  const landing = {
    headline: `${sentenceCase(product)} for ${sentenceCase(audience)}`,
    subheadline: `${business} helps ${audience} ${pains[0] ? `eliminate ${pains[0]}` : "work smarter"} with ${diff}. Go live in weeks, not months.`,
    bullets: [
      `${sentenceCase(diff)} out-of-the-box`,
      `Onboard in days, not months`,
      `Security-first: SSO, audit trails, role-based access`,
      `Measured outcomes in 30?90 days`,
    ],
    socialProof: `Trusted by modern ${industry} teams across ${input.location || "your markets"}`,
    cta: primaryCta,
  };

  const faq = [
    { q: "How fast is implementation?", a: "Most teams launch in 2?4 weeks with guided onboarding." },
    { q: "How do you handle security?", a: "SSO, encryption in transit/at rest, least-privilege access, vendor reviews supported." },
    { q: "What results can we expect?", a: `Teams report 30?70% reduction in ${pains[0] || "manual effort"} in the first quarter.` },
    { q: "What does pricing look like?", a: "Transparent packaging with annual options; contact us for a tailored quote." },
    { q: "Do you integrate with existing tools?", a: "Yes, native connectors and APIs reduce change management risk." },
  ];

  const seoKeywords = [
    `${industry} ${product}`,
    `${audience} ${product}`,
    `${product} alternatives`,
    `${industry} automation`,
    `${industry} software`,
    `${audience} tools`,
    `${industry} ROI calculator`,
  ];

  const contentIdeas = [
    `Playbook: Eliminating ${pains[0] || "manual work"} in ${industry}`,
    `ROI model: ${product} for ${audience}`,
    `Case study: From ${pains[1] || "spreadsheets"} to outcomes in 30 days`,
    `Checklist: Vendor security review for ${industry}`,
    `Framework: 90-day rollout plan for ${product}`,
    `Benchmark: ${industry} KPIs that matter in 2025`,
    `Guide: Change management for ${audience}`,
    `Template: Executive one-pager for ${product}`,
    `Webinar: Live teardown of ${audience} workflows`,
    `FAQ: Everything to evaluate ${product}`,
  ];

  const snippets = [
    `${product} cuts ${pains[0] || "busywork"} by up to 70% in 90 days`,
    `Onboard in weeks, not months`,
    `${diff} without the heavy lift`,
    `Built for ${audience}`,
    `Security-first. Enterprise ready.`,
  ];

  return {
    icp,
    persona,
    valueProp,
    elevator,
    ctas,
    emailSequence: [email1, email2, email3],
    linkedinDm,
    landing,
    faq,
    seoKeywords,
    contentIdeas,
    snippets,
  };
}

async function openaiGenerate(input: LeadInput): Promise<LeadResult> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const sys = `You are a senior B2B marketer generating a complete lead generation asset pack. Tone: ${input.tone}. Output concise, concrete, and useful assets.`;
  const user = `Create a lead generation pack for a business. Respond in strict JSON with keys: icp, persona, valueProp, elevator, ctas, emailSequence, linkedinDm, landing{headline,subheadline,bullets,socialProof,cta}, faq[{q,a}], seoKeywords, contentIdeas, snippets.
Business name: ${input.businessName}
Industry: ${input.industry}
Product: ${input.product}
Audience: ${input.audience}
Pains: ${input.pains}
Differentiator: ${input.differentiator}
Website: ${input.website || ""}
Location: ${input.location || ""}
Channels: ${input.channels.join(", ")}
Primary CTA: ${input.primaryCta}`;

  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    temperature: 0.5,
    messages: [
      { role: "system", content: sys },
      { role: "user", content: user },
    ],
    response_format: { type: "json_object" as const },
  });

  const text = completion.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(text);
  // Basic normalization to ensure fields exist
  return {
    icp: parsed.icp ?? "",
    persona: parsed.persona ?? "",
    valueProp: parsed.valueProp ?? "",
    elevator: parsed.elevator ?? "",
    ctas: parsed.ctas ?? [],
    emailSequence: parsed.emailSequence ?? [],
    linkedinDm: parsed.linkedinDm ?? "",
    landing: parsed.landing ?? { headline: "", subheadline: "", bullets: [], socialProof: "", cta: input.primaryCta },
    faq: parsed.faq ?? [],
    seoKeywords: parsed.seoKeywords ?? [],
    contentIdeas: parsed.contentIdeas ?? [],
    snippets: parsed.snippets ?? [],
  } as LeadResult;
}

export async function generateLeadPack(input: LeadInput): Promise<LeadResult> {
  if (process.env.OPENAI_API_KEY) {
    try {
      return await openaiGenerate(input);
    } catch (err) {
      // Fallback on any error
      return fallbackGenerate(input);
    }
  }
  return fallbackGenerate(input);
}
