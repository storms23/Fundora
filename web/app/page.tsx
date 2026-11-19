import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Journey from "./sponsors/Journey";
import s from "./sponsors/premiere.module.css";

export const metadata: Metadata = {
  title: "Fundora | Open. Verify. Transact.",
  description:
    "Follow one community workshop stipend from independent human review to sponsor-authorized release on Stellar Testnet.",
};

export default function HomePage() {
  return (
    <main className={s.page} id="top">
      <a className="skip-link" href="#story">
        Skip to the award story
      </a>
      <header className={s.nav}>
        <Link href="/" aria-label="Fundora home">
          <Image src="/fundora/wordmark.webp" alt="Fundora" width={126} height={20} />
        </Link>
        <nav aria-label="Primary">
          <a href="#story">The award</a>
          <a href="#support">Sponsorship</a>
          <Link href="/enter">Sign in</Link>
        </nav>
      </header>

      <section className={s.hero}>
        <div className={s.heroCopy}>
          <p className={s.label}>Open. Verify. Transact.</p>
          <h1>
            Behind every
            <br />
            stipend, <em>a story.</em>
          </h1>
          <p>
            Fundora connects a workshop participant’s completion record to an
            independent review and a sponsor’s decision to pay.
          </p>
          <div className={s.actions}>
            <a className={s.cta} href="#story">
              Follow one award <span aria-hidden="true">↓</span>
            </a>
            <Link href="/enter">Sign in to a workspace ↗</Link>
          </div>
        </div>
        <div className={s.studio}>
          <div className={s.plinth}>
            <Image
              src="/fundora/identity.webp"
              width={744}
              height={502}
              priority
              alt="Fundora’s evergreen F and orange release arrow above the official wordmark"
            />
          </div>
        </div>
      </section>

      <div className={s.strip}>
        <b>Stellar Testnet</b>
        <span>Testnet XLM — no real monetary value</span>
      </div>

      <section className={s.context}>
        <Image
          src="/fundora/workshop.webp"
          width={960}
          height={640}
          alt="Illustrative scene of hands working together at a workshop table"
        />
        <div>
          <p className={s.label}>Community workshops</p>
          <h2>
            Who checked
            <br />
            the work?
          </h2>
          <p>
            A payment receipt tells a sponsor where a stipend went. A workshop
            also needs a record of who completed the training, who checked it,
            and which evidence supported the decision.
          </p>
          <p>
            Fundora gives each participant a separate award. Their evidence stays
            private while the approval and transfer can be traced.
          </p>
        </div>
      </section>

      <Journey />

      <section className={s.support} id="support">
        <p className={s.label}>For prospective sponsors</p>
        <h2>
          Help put the next
          <br />
          <em>award to the test.</em>
        </h2>
        <p>
          Fundora supports one workshop and up to ten enrolled recipients. Live
          submission, approval, and payout each need a separate wallet signature.
          Help evaluate what a workshop organizer and a sponsor need to see at
          each decision.
        </p>
        <div className={s.actions}>
          <a className={s.cta} href="/fundora/sponsor-brief.txt" download>
            Download sponsor brief ↓
          </a>
          <Link href="/enter">Sign in ↗</Link>
        </div>
      </section>

      <footer className={s.footer}>
        <span>Fundora · Open. Verify. Transact.</span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </main>
  );
}
