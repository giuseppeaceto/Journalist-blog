import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  description: string;
  href: string;
  action: string;
  image?: string;
  imageAlt?: string;
  icon?: LucideIcon;
  layout?: "horizontal" | "vertical";
  external?: boolean;
};

export function HomeEditorialCard({
  title,
  description,
  href,
  action,
  image,
  imageAlt = "",
  icon: Icon,
  layout = "vertical",
  external = false,
}: Props) {
  const horizontal = layout === "horizontal";
  const content = (
    <>
      <div
        className={`relative shrink-0 overflow-hidden bg-glow/30 ${
          horizontal ? "aspect-square w-[38%]" : "aspect-[16/9] w-full"
        }`}
      >
        {image ? (
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes={
              horizontal
                ? "(max-width: 640px) 38vw, 220px"
                : "(max-width: 768px) 100vw, 360px"
            }
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : Icon ? (
          <span className="absolute inset-0 flex items-center justify-center text-accent">
            <Icon className="size-10" aria-hidden />
          </span>
        ) : null}
      </div>
      <span className={`flex min-w-0 flex-1 flex-col p-4 sm:p-5`}>
        <span className="font-display text-xl font-semibold leading-tight tracking-tight text-ink group-hover:text-accent sm:text-2xl">
          {title}
        </span>
        <span className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{description}</span>
        <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-accent">
          {action}
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </span>
      </span>
    </>
  );

  const className = `group flex h-full overflow-hidden rounded-2xl border border-line/80 bg-card/90 transition hover:-translate-y-0.5 hover:border-accent/45 ${
    horizontal ? "flex-row" : "flex-col"
  }`;

  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {content}
    </a>
  ) : (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
