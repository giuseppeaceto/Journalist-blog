import type { Metadata } from "next";
import { Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Contatti",
  description:
    "Scrivi a Nadia Clementi per idee, collaborazioni, interviste o semplicemente per dire la tua.",
};

export default function ContattiPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 pb-12 pt-28 sm:pb-16 sm:pt-32">
      <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-glow/60 text-accent">
        <Mail className="size-5" aria-hidden />
      </span>
      <p className="mt-5 text-xs font-medium uppercase tracking-[0.22em] text-accent">Contattami</p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Scrivimi</h1>
      <p className="mt-4 text-lg leading-relaxed text-muted">
        Sono sempre felice di entrare in contatto con lettori, collaboratori e professionisti. Che
        tu voglia condividere un’idea, fare una domanda o semplicemente dire la tua, sentiti libero
        di scrivermi.
      </p>

      <form className="mt-10 space-y-5" action="mailto:info@nadiaclementi.it" method="get">
        <div>
          <label htmlFor="name" className="block text-sm text-muted">
            Il tuo nome
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="mt-1.5 w-full rounded-xl border border-line bg-card px-3 py-2.5 outline-none focus:border-accent"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm text-muted">
            La tua email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1.5 w-full rounded-xl border border-line bg-card px-3 py-2.5 outline-none focus:border-accent"
          />
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm text-muted">
            Oggetto
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            className="mt-1.5 w-full rounded-xl border border-line bg-card px-3 py-2.5 outline-none focus:border-accent"
          />
        </div>
        <div>
          <label htmlFor="body" className="block text-sm text-muted">
            Il tuo messaggio
          </label>
          <textarea
            id="body"
            name="body"
            rows={6}
            className="mt-1.5 w-full rounded-xl border border-line bg-card px-3 py-2.5 outline-none focus:border-accent"
          />
        </div>
        <button
          type="submit"
          className="rounded-full bg-accent-deep px-5 py-2.5 text-sm font-medium text-white transition hover:bg-accent"
        >
          Invia
        </button>
      </form>

      <p className="mt-8 text-sm text-muted">
        Puoi anche trovarmi su{" "}
        <a
          href="https://www.linkedin.com/"
          className="text-accent hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>{" "}
        e Instagram, o visitare il sito attuale su{" "}
        <a
          href="https://www.nadiaclementi.it/"
          className="text-accent hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          nadiaclementi.it
        </a>
        .
      </p>
    </div>
  );
}
