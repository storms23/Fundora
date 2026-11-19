import { BrandLink } from "@/components/BrandLink";
import Link from "next/link";
import { PageHeading } from "@/components/PageHeading";
import { SkipLink } from "@/components/SkipLink";
import { TestnetBanner } from "@/components/TestnetBanner";

const DOORS = [
  {
    slug: "sponsor",
    title: "Fund community projects",
    body: "Fund awards and release approved payments.",
    icon: (
      <>
        <rect x="3" y="7" width="18" height="14" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18" />
      </>
    ),
  },
  {
    slug: "verifier",
    title: "Give every submission a careful look",
    body: "Inspect evidence and record independent decisions.",
    icon: (
      <>
        <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  },
  {
    slug: "recipient",
    title: "Know your next step",
    body: "Submit evidence and follow your own award.",
    icon: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M5 21a7 7 0 0 1 14 0" />
      </>
    ),
  },
  {
    slug: "administrator",
    title: "Manage project access",
    body: "Provision members and manage project access.",
    icon: (
      <>
        <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3" />
        <path d="M2 14h4M10 8h4M18 16h4" />
      </>
    ),
  },
] as const;

export default function EntryPage() {
  return (
    <>
      <SkipLink />
      <TestnetBanner />
      <main className="entry-page" id="main">
        <div className="entry-masthead">
          <BrandLink href="/" />
          <span className="entry-environment">
            <span className="banner-signal" aria-hidden="true" />
            Provisioned access only
          </span>
        </div>
        <PageHeading
          title="Choose your workspace"
          lead="Each door explains a job. Signing in does not grant that role — only a provisioned membership does. There is no public signup."
        />
        <div className="entry-grid">
          {DOORS.map((door) => (
            <section key={door.slug} className="workspace-door">
              <span className="door-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  {door.icon}
                </svg>
              </span>
              <h2>{door.slug[0]!.toUpperCase() + door.slug.slice(1)}</h2>
              <p className="door-title">{door.title}</p>
              <p>{door.body}</p>
              <Link className="button" href={"/login/" + door.slug}>
                Continue as {door.slug}
                <span aria-hidden="true">→</span>
              </Link>
            </section>
          ))}
        </div>
        <p className="demo-label">
          <Link href="/sponsors">Explore Fundora for sponsors →</Link>
        </p>
      </main>
    </>
  );
}
