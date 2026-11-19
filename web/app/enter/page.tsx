import Image from "next/image";
import Link from "next/link";
import { SkipLink } from "@/components/SkipLink";
import { TestnetBanner } from "@/components/TestnetBanner";
import s from "./enter.module.css";

const DOORS = [
  {
    slug: "sponsor",
    label: "Sponsor",
    title: "Fund community projects",
    body: "Fund awards and release approved payments.",
    art: "/fundora/role-sponsor.jpg",
  },
  {
    slug: "verifier",
    label: "Verifier",
    title: "Give every submission a careful look",
    body: "Inspect evidence and record independent decisions.",
    art: "/fundora/role-verifier.jpg",
  },
  {
    slug: "recipient",
    label: "Recipient",
    title: "Know your next step",
    body: "Submit evidence and follow your own award.",
    art: "/fundora/role-recipient.jpg",
  },
  {
    slug: "administrator",
    label: "Administrator",
    title: "Manage project access",
    body: "Provision members and manage project access.",
    art: "/fundora/role-administrator.jpg",
  },
] as const;

export default function EnterPage() {
  return (
    <>
      <SkipLink />
      <TestnetBanner />
      <main className={s.shell} id="main">
        <div className={s.backdrop} aria-hidden="true">
          <Image
            src="/fundora/enter-landscape.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className={s.veil} aria-hidden="true" />

        <div className={s.inner}>
          <header className={s.nav}>
            <Link className={s.brand} href="/" aria-label="Fundora home">
              <Image
                src="/fundora/wordmark.webp"
                alt="Fundora"
                width={126}
                height={20}
                priority
              />
            </Link>
            <span className={s.pill}>
              <span className={s.signal} aria-hidden="true" />
              Provisioned access only
            </span>
          </header>

          <section className={s.hero}>
            <p className={s.eyebrow}>Choose your workspace</p>
            <h1>Welcome to Fundora</h1>
            <p className={s.lead}>
              Pick the door that matches your role. Signing in does not grant
              access by itself — only a provisioned membership does. There is no
              public signup.
            </p>
          </section>

          <div className={s.grid}>
            {DOORS.map((door) => (
              <section key={door.slug} className={s.card}>
                <div className={s.art} aria-hidden="true">
                  <Image
                    src={door.art}
                    alt=""
                    width={512}
                    height={512}
                    sizes="(max-width: 640px) 90vw, (max-width: 1100px) 40vw, 220px"
                  />
                </div>
                <div className={s.copy}>
                  <h2>{door.label}</h2>
                  <p className={s.title}>{door.title}</p>
                  <p className={s.body}>{door.body}</p>
                </div>
                <Link className={s.cta} href={"/login/" + door.slug}>
                  Continue as {door.slug}
                  <span aria-hidden="true">→</span>
                </Link>
              </section>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
