import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BackButton } from "@/components/back-button";
import { PressCard3D } from "@/components/press-card-3d";

const sections = [
  { id: "percorso", number: "01", title: "Il mio percorso" },
  { id: "ascolto", number: "02", title: "Il giornalismo come ascolto" },
  { id: "orizzonte", number: "03", title: "Uno sguardo senza confini" },
  { id: "personale", number: "04", title: "La vita e la scrittura" },
  { id: "responsabilita", number: "05", title: "Informazione e responsabilità" },
];

export function AboutBiography({ title }: { title: string }) {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-28 sm:pb-20 sm:pt-32">
      {/* Intestazione editoriale d'autore su fondo carta */}
      <div className="grid items-center gap-8 pb-12 sm:pb-16 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16">
        <div>
          <BackButton href="/" label="Indietro" />
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            La giornalista · Trento
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-6xl">
            {title}
          </h1>
          <blockquote className="mt-6 border-l-2 border-accent pl-5 font-display text-2xl italic leading-snug text-ink/90 sm:text-3xl xl:text-[2.25rem]">
            «Ci sono persone che attraversano la vita cercando risposte. Io ho sempre preferito
            farmi domande.»
          </blockquote>
        </div>

        <div className="relative mx-auto flex w-full max-w-[340px] justify-center lg:mx-0 lg:ml-auto">
          <div className="relative size-64 overflow-hidden rounded-full border border-line/80 bg-hero/15 ring-4 ring-white shadow-lg sm:size-72 lg:size-80">
            <Image
              src="/nadia-cutout.png"
              alt="Nadia Clementi, giornalista pubblicista freelance"
              fill
              priority
              sizes="(max-width: 640px) 256px, (max-width: 1024px) 288px, 320px"
              className="size-full object-cover object-top transition duration-500 hover:scale-105"
            />
          </div>
        </div>
      </div>

      {/* Corpo biografia con indice ancorato */}
      <div className="border-t border-line/80 pt-10 sm:pt-14 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted">
            In questa pagina
          </p>
          <nav aria-label="Indice della biografia">
            <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="inline-flex rounded-full border border-line px-3 py-1.5 text-sm text-ink/75 transition hover:border-accent hover:text-accent lg:block lg:rounded-none lg:border-0 lg:border-l-2 lg:px-4 lg:py-2"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <article className="min-w-0 max-w-3xl">
          <section id="percorso" className="scroll-mt-28 border-t border-line/80 py-9 first:border-0 first:pt-0">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
              01 · Il percorso
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Dalle domande alle storie
            </h2>
            <div className="mt-5 space-y-5 text-base leading-8 text-muted sm:text-lg">
              <p>
                Forse è proprio da qui che nasce la mia passione per la scrittura: dal desiderio di
                comprendere ciò che mi circonda, di andare oltre le apparenze, di ascoltare le
                persone e scoprire quanto di straordinario possa nascondersi anche nelle storie più
                semplici.
              </p>
              <p>
                Mi chiamo Nadia Clementi, vivo a Trento e sono una giornalista pubblicista freelance.
                Dal 2012 collaboro con il quotidiano online L’Adigetto, dove curo la rubrica
                domenicale «Parliamone», uno spazio dedicato agli incontri, alle interviste e agli
                approfondimenti. Parallelamente, dal 1991 lavoro nel mondo della cultura e dello
                spettacolo presso il Centro Servizi Culturali S. Chiara di Trento. Due percorsi che
                si intrecciano e si arricchiscono reciprocamente.
              </p>
              <p>
                Credo che la cultura non sia soltanto conoscenza, ma apertura mentale, sensibilità e
                capacità di osservare il mondo da prospettive diverse.
              </p>
            </div>

            <PressCard3D />
          </section>

          <section id="ascolto" className="scroll-mt-28 border-t border-line/80 py-9">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
              02 · Il giornalismo
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Il giornalismo come ascolto
            </h2>
            <div className="mt-5 space-y-5 text-base leading-8 text-muted sm:text-lg">
              <p>
                Nel giornalismo ho trovato un modo per dare forma alla mia curiosità. Amo incontrare
                le persone, ascoltare le loro esperienze, dialogare con chi dedica la propria vita
                alla medicina, alla scienza e alla ricerca, ma anche con chi, lontano dai
                riflettori, compie gesti capaci di lasciare un segno.
              </p>
              <p>
                La medicina e la ricerca scientifica occupano un posto importante nel mio lavoro.
                Attraverso le interviste cerco di avvicinare il sapere degli specialisti alla vita
                quotidiana, rendendo comprensibili temi complessi senza rinunciare al rigore e
                all’autorevolezza delle fonti.
              </p>
            </div>
          </section>

          <section id="orizzonte" className="scroll-mt-28 border-t border-line/80 py-9">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
              03 · Uno sguardo aperto
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Uno sguardo senza confini
            </h2>
            <div className="mt-5 space-y-5 text-base leading-8 text-muted sm:text-lg">
              <p>
                La mia curiosità non conosce confini prestabiliti. Mi appassionano l’arte, la
                letteratura, il teatro, la società e i viaggi.
              </p>
              <p>
                Viaggiare, per me, significa molto più che attraversare luoghi: è incontrare altre
                culture, mettere in discussione le proprie certezze e tornare con uno sguardo diverso
                su ciò che credevamo di conoscere.
              </p>
            </div>
          </section>

          <section id="personale" className="scroll-mt-28 border-t border-line/80 py-9">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
              04 · La dimensione personale
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              La vita e la scrittura
            </h2>
            <div className="mt-5 space-y-5 text-base leading-8 text-muted sm:text-lg">
              <p>
                Sono anche madre di tre figli, forse il viaggio più intenso e significativo della
                mia vita. La maternità mi ha insegnato che crescere significa imparare ogni giorno,
                confrontarsi con le proprie fragilità, trovare risorse inattese e comprendere che
                l’amore più profondo è quello capace di accompagnare senza trattenere. Un’esperienza
                che ha arricchito il mio modo di osservare le persone e le sfumature dell’esistenza.
              </p>
              <p>
                Accanto al giornalismo c’è poi una dimensione più intima della scrittura, quella che
                raccolgo nel mio Diario. È uno spazio dove lascio parlare la memoria, gli affetti, le
                assenze, la nostalgia e quelle emozioni che spesso, nella frenesia quotidiana, non
                trovano il tempo di essere ascoltate. Perché non tutto ciò che conta diventa una
                notizia. Alcune storie appartengono semplicemente all’anima e meritano comunque di
                essere custodite attraverso le parole.
              </p>
            </div>
            <Link
              href="/diario"
              className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
            >
              Entra nel Diario
              <ArrowRight className="size-4" />
            </Link>
          </section>

          <section
            id="responsabilita"
            className="scroll-mt-28 border-t border-line/80 py-9"
          >
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
              05 · Informazione e responsabilità
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              L’informazione come ponte
            </h2>
            <div className="mt-5 space-y-5 text-base leading-8 text-muted sm:text-lg">
              <p>
                Credo nel valore dell’informazione come ponte tra mondi diversi. Una notizia può
                nascere da una voce quasi sconosciuta, da un incontro casuale o da una domanda
                apparentemente semplice, e raggiungere molte persone grazie al giornalismo e ai
                social media. Ma perché abbia valore deve essere ascoltata, verificata, approfondita
                e condivisa con responsabilità.
              </p>
              <p>
                Non amo definirmi attraverso i traguardi raggiunti, pur custodendo con gratitudine
                gli incontri, le pubblicazioni e i riconoscimenti che hanno accompagnato il mio
                cammino. Preferisco pensare che ogni esperienza sia una pagina di un racconto ancora
                da scrivere.
              </p>
            </div>
            <blockquote className="mt-8 border-l-2 border-accent pl-5 font-display text-2xl leading-snug text-ink sm:text-3xl">
              Conservo una convinzione: la conoscenza ci rende più liberi, l’ascolto più umani e la
              curiosità ci impedisce di smettere di crescere.
            </blockquote>
            <p className="mt-6 text-base leading-8 text-muted sm:text-lg">
              In fondo, scrivo per questo: per continuare a conoscere, per dare voce a ciò che
              merita attenzione e, qualche volta, per ritrovare nelle parole anche una parte di me.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
