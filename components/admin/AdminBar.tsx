import Link from "next/link";
import { SignOutButton } from "./SignOutButton";

export function AdminBar({ title }: { title: string }) {
  return (
    <div className="admin-bar">
      <h1>{title}</h1>
      <div className="bar-links">
        <Link className="mini" href="/admin">
          Dashboard
        </Link>
        <Link className="mini" href="/" target="_blank">
          View site ↗
        </Link>
        <SignOutButton />
      </div>
    </div>
  );
}
