import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Owner sign-in" };

export default function LoginPage() {
  return (
    <div className="wrap">
      <div className="login-card">
        <h1>Owner sign-in</h1>
        <p className="sub">
          One account, set up by your web person. Public sign-ups are
          disabled.
        </p>
        <LoginForm />
        <p className="hint" style={{ marginTop: 18 }}>
          <Link href="/">← Back to the website</Link>
        </p>
      </div>
    </div>
  );
}
