import "../globals.css";
import { SiteShell } from "@/components/layout/SiteShell";

// Feedback Studio edit bar: staging copy previews only, never production.
const showEditBar = process.env.VERCEL_ENV === "preview";

export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SiteShell>{children}</SiteShell>
      {showEditBar && <script src="https://ttr-portal.vercel.app/api/site/notes/bar" async />}
    </>
  );
}
