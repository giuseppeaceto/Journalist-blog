import Link from "next/link";

export function Pagination({
  page,
  totalPages,
  hrefFor,
}: {
  page: number;
  totalPages: number;
  hrefFor: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav className="mt-12 flex items-center justify-between border-t border-line pt-6 text-sm">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className="text-accent hover:underline">
          ← Precedenti
        </Link>
      ) : (
        <span />
      )}
      <p className="text-muted">
        {page} / {totalPages}
      </p>
      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} className="text-accent hover:underline">
          Successivi →
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
