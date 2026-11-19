import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeading } from "@/components/PageHeading";
import { SkipLink } from "@/components/SkipLink";
import { TestnetBanner } from "@/components/TestnetBanner";
import { LoginForm } from "../LoginForm";

const DOORS: Record<
  string,
  { label: string; explain: string }
> = {
  sponsor: {
    label: "Sponsor",
    explain:
      "This door is for the sponsor workspace. Signing in does not grant sponsor access by itself.",
  },
  verifier: {
    label: "Verifier",
    explain:
      "This door is for the verifier workspace. Signing in does not grant verifier access by itself.",
  },
  recipient: {
    label: "Recipient",
    explain:
      "This door is for the recipient workspace. Signing in does not grant recipient access by itself.",
  },
  administrator: {
    label: "Administrator",
    explain:
      "This door is for program administration. Administrators cannot move funds or open private evidence.",
  },
};

export default async function LoginDoorPage({
  params,
}: {
  params: Promise<{ door: string }>;
}) {
  const { door } = await params;
  const meta = DOORS[door];
  if (!meta) notFound();

  return (
    <>
      <SkipLink />
      <TestnetBanner />
      <main className="login-page" id="main">
        <div className="login-card">
          <section className="login-intro">
            <div>
              <Link className="login-mark" href="/" aria-label="Fundora home">
                <Image
                  src="/fundora/mark-f.png"
                  alt=""
                  width={72}
                  height={60}
                  priority
                />
              </Link>
              <PageHeading title={meta.label + " sign in"} lead={meta.explain} />
            </div>
            <p className="login-note">
              Sign in with the account your organizer provisioned for this role.
            </p>
          </section>
          <section className="login-form-panel" aria-label="Sign in">
            <div className="login-form-head">
              <p className="eyebrow">PROVISIONED ACCOUNT</p>
              <h2>Account details</h2>
            </div>
            <LoginForm door={door} />
          </section>
        </div>
      </main>
    </>
  );
}
