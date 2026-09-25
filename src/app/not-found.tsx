import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-20">
      <p className="text-xs uppercase tracking-[0.22em] text-accent">404</p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">Questa pagina non c’è.</h1>
      <Link href="/" className="mt-6 inline-block text-accent hover:underline">
        Torna alla home
      </Link>
    </div>
  );
}
