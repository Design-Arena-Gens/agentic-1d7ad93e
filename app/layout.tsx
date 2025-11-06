import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LeadGen AI Agent",
  description: "Generate lead gen assets for any business",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header className="header">
            <h1>LeadGen AI Agent</h1>
            <p className="subtitle">From ICP to email sequences in seconds</p>
          </header>
          <main>{children}</main>
          <footer className="footer">? {new Date().getFullYear()} LeadGen AI</footer>
        </div>
      </body>
    </html>
  );
}
