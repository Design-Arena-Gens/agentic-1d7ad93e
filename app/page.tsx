"use client";
import { useState } from "react";

type Input = {
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

type Result = {
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

export default function Page() {
  const [input, setInput] = useState<Input>({
    businessName: "",
    industry: "",
    product: "",
    audience: "",
    pains: "",
    differentiator: "",
    tone: "clear and confident",
    website: "",
    location: "",
    channels: ["email", "linkedin"],
    primaryCta: "Book a demo",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  const update = (field: keyof Input, value: any) => setInput((p) => ({ ...p, [field]: value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error(await res.text());
      const data: Result = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err?.message ?? "Failed to generate");
    } finally {
      setLoading(false);
    }
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text);
  }

  function toMarkdown(r: Result) {
    return `# LeadGen AI Pack\n\n## ICP\n${r.icp}\n\n## Persona\n${r.persona}\n\n## Value Proposition\n${r.valueProp}\n\n## Elevator Pitch\n${r.elevator}\n\n## CTAs\n${r.ctas.map((c) => `- ${c}`).join("\n")}\n\n## Cold Email Sequence\n${r.emailSequence.map((e, i) => `### Email ${i + 1}\n${e}`).join("\n\n")}\n\n## LinkedIn DM\n${r.linkedinDm}\n\n## Landing Page\n### Headline\n${r.landing.headline}\n\n### Subheadline\n${r.landing.subheadline}\n\n### Bullets\n${r.landing.bullets.map((b) => `- ${b}`).join("\n")}\n\n### Social Proof\n${r.landing.socialProof}\n\n### CTA\n${r.landing.cta}\n\n## FAQ\n${r.faq.map((f) => `- **${f.q}**: ${f.a}`).join("\n")}\n\n## SEO Keywords\n${r.seoKeywords.map((k) => `\`${k}\``).join(" ")}\n\n## Content Ideas\n${r.contentIdeas.map((c) => `- ${c}`).join("\n")}\n\n## Snippets\n${r.snippets.map((s) => `- ${s}`).join("\n")}`;
  }

  function download(filename: string, content: string, type = "text/plain") {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([content], { type }));
    a.download = filename;
    a.click();
  }

  function landingHtml(r: Result) {
    return `<!doctype html><html lang=\"en\"><meta charset=\"utf-8\"/><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"/>
    <title>${r.landing.headline}</title>
    <style>body{font-family:system-ui,Segoe UI,Roboto;background:#0b1020;color:#eef2ff;margin:0;padding:40px} .card{max-width:860px;margin:0 auto;background:#101735;border:1px solid #223064;border-radius:16px;padding:24px} .btn{background:linear-gradient(90deg,#6d8bff,#8ff0a4);color:#081023;border:none;border-radius:10px;padding:12px 16px;font-weight:800} .muted{color:#b9c2da}</style>
    <div class=\"card\"><h1>${r.landing.headline}</h1><p class=\"muted\">${r.landing.subheadline}</p><ul>${r.landing.bullets.map((b)=>`<li>${b}</li>`).join("")}</ul><p>${r.landing.socialProof}</p><button class=\"btn\">${r.landing.cta}</button></div>`;
  }

  return (
    <div className="card">
      <form onSubmit={onSubmit}>
        <div className="row">
          <div>
            <label>Business name</label>
            <input value={input.businessName} onChange={(e) => update("businessName", e.target.value)} required />
          </div>
          <div>
            <label>Industry</label>
            <input value={input.industry} onChange={(e) => update("industry", e.target.value)} placeholder="e.g. Fintech, SaaS, Healthcare" required />
          </div>
        </div>
        <div className="row">
          <div>
            <label>Product / service</label>
            <input value={input.product} onChange={(e) => update("product", e.target.value)} required />
          </div>
          <div>
            <label>Target audience</label>
            <input value={input.audience} onChange={(e) => update("audience", e.target.value)} placeholder="e.g. SMB CFOs in US" required />
          </div>
        </div>
        <div className="row">
          <div>
            <label>Key pains</label>
            <input value={input.pains} onChange={(e) => update("pains", e.target.value)} placeholder="comma-separated" />
            <div className="help">Top 3-5 pains, comma-separated</div>
          </div>
          <div>
            <label>What differentiates you?</label>
            <input value={input.differentiator} onChange={(e) => update("differentiator", e.target.value)} />
          </div>
        </div>
        <div className="row">
          <div>
            <label>Preferred tone</label>
            <select value={input.tone} onChange={(e) => update("tone", e.target.value)}>
              <option>clear and confident</option>
              <option>friendly and helpful</option>
              <option>concise and direct</option>
              <option>warm and persuasive</option>
              <option>authoritative and data-driven</option>
            </select>
          </div>
          <div>
            <label>Primary CTA</label>
            <input value={input.primaryCta} onChange={(e) => update("primaryCta", e.target.value)} />
          </div>
        </div>
        <div className="row">
          <div>
            <label>Website (optional)</label>
            <input value={input.website} onChange={(e) => update("website", e.target.value)} placeholder="https://..." />
          </div>
          <div>
            <label>Location / markets</label>
            <input value={input.location} onChange={(e) => update("location", e.target.value)} placeholder="e.g. US, EU" />
          </div>
        </div>
        <div className="section">
          <label>Channels</label>
          <div className="actions">
            {[
              { key: "email", label: "Email" },
              { key: "linkedin", label: "LinkedIn" },
              { key: "twitter", label: "Twitter" },
            ].map((c) => (
              <label key={c.key} className="badge">
                <input
                  type="checkbox"
                  checked={input.channels.includes(c.key)}
                  onChange={(e) =>
                    update(
                      "channels",
                      e.target.checked
                        ? [...input.channels, c.key]
                        : input.channels.filter((x) => x !== c.key)
                    )
                  }
                /> {c.label}
              </label>
            ))}
          </div>
        </div>
        <div className="actions section">
          <button type="submit" disabled={loading}>{loading ? "Generating..." : "Generate Lead Pack"}</button>
          <button type="button" className="secondary" onClick={() => setResult(null)}>Reset Output</button>
        </div>
      </form>

      {error && (
        <div className="section">
          <pre>{error}</pre>
        </div>
      )}

      {result && (
        <div className="section">
          <div className="actions">
            <button className="copy" onClick={() => copy(toMarkdown(result))}>Copy Markdown</button>
            <button className="download" onClick={() => download("leadpack.md", toMarkdown(result), "text/markdown")}>Download Markdown</button>
            <button className="download" onClick={() => download("landing.html", landingHtml(result), "text/html")}>Download Landing HTML</button>
          </div>
          <hr />
          <div className="row">
            <div>
              <h3>ICP</h3>
              <pre>{result.icp}</pre>
              <h3>Persona</h3>
              <pre>{result.persona}</pre>
              <h3>Value Proposition</h3>
              <pre>{result.valueProp}</pre>
              <h3>Elevator Pitch</h3>
              <pre>{result.elevator}</pre>
            </div>
            <div>
              <h3>CTAs</h3>
              <pre>{result.ctas.map((c) => `? ${c}`).join("\n")}</pre>
              <h3>Cold Email Sequence</h3>
              {result.emailSequence.map((e, i) => (
                <details key={i} open>
                  <summary>Email {i + 1}</summary>
                  <pre>{e}</pre>
                </details>
              ))}
              <h3>LinkedIn DM</h3>
              <pre>{result.linkedinDm}</pre>
            </div>
          </div>
          <hr />
          <div className="row">
            <div>
              <h3>Landing Page</h3>
              <pre>{`${result.landing.headline}\n\n${result.landing.subheadline}\n\n- ${result.landing.bullets.join("\n- ")}\n\n${result.landing.socialProof}\n\nCTA: ${result.landing.cta}`}</pre>
            </div>
            <div>
              <h3>FAQ</h3>
              <pre>{result.faq.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n")}</pre>
              <h3>SEO Keywords</h3>
              <pre>{result.seoKeywords.join(", ")}</pre>
              <h3>Content Ideas</h3>
              <pre>{result.contentIdeas.map((c) => `? ${c}`).join("\n")}</pre>
              <h3>Snippets</h3>
              <pre>{result.snippets.map((s) => `? ${s}`).join("\n")}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
