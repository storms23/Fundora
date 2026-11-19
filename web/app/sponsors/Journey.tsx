"use client";

import { useEffect, useRef, useState } from "react";
import s from "./premiere.module.css";

const stages = [
  {
    id: "fund",
    role: "Sponsor",
    title: "Set the terms.",
    detail:
      "The sponsor sets a completion requirement and deadlines, then funds a fixed award for one enrolled recipient.",
    state: "Award funded",
  },
  {
    id: "submit",
    role: "Recipient",
    title: "Submit the record.",
    detail:
      "The participant submits private evidence and signs a commitment to that version. Personal documents stay off-chain.",
    state: "Evidence submitted",
  },
  {
    id: "review",
    role: "Verifier",
    title: "Check the source.",
    detail:
      "A separately appointed verifier compares the submission with the organizer’s completion record. Approval applies to that specific version.",
    state: "Completion approved",
  },
  {
    id: "release",
    role: "Sponsor",
    title: "Authorize release.",
    detail:
      "The sponsor separately signs the payout. A hold blocks payment, and an unpaid award can return to the original sponsor after expiry.",
    state: "Payout authorized",
  },
] as const;

export default function Journey() {
  const region = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = region.current;
    if (!root) return;

    const chapters = Array.from(root.querySelectorAll<HTMLElement>("article"));
    let frame = 0;

    function update() {
      frame = 0;
      const threshold = Math.max(48, window.innerHeight * 0.16);
      let index = 0;
      chapters.forEach((chapter, i) => {
        if (chapter.getBoundingClientRect().top <= threshold) index = i;
      });
      setActive(index);
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <section
      ref={region}
      className={s.story}
      id="story"
      aria-label="Follow one workshop award"
    >
      <div className={s.pin}>
        <p className={s.label}>Illustrative award · Workshop stipend</p>
        <h2>
          One award.
          <br />
          Four decisions.
        </h2>
        <div className={s.ticket} aria-hidden="true">
          <small>FIXED STIPEND</small>
          <strong>
            20 <i>Testnet XLM</i>
          </strong>
          <div className={s.track}>
            <b style={{ width: `${(active + 1) * 25}%` }} />
          </div>
          <span key={active}>{stages[active].state}</span>
        </div>
        <nav className={s.chapters} aria-label="Jump to a decision">
          {stages.map((stage, i) => (
            <a
              key={stage.id}
              href={`#${stage.id}`}
              aria-label={`Jump to ${stage.title}`}
              aria-current={i === active ? "step" : undefined}
            >
              0{i + 1}
            </a>
          ))}
        </nav>
      </div>
      <div>
        {stages.map((stage, i) => (
          <article key={stage.id} id={stage.id} className={s.chapter}>
            <p className={s.label}>
              0{i + 1} / {stage.role}
            </p>
            <h3>{stage.title}</h3>
            <p>{stage.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
