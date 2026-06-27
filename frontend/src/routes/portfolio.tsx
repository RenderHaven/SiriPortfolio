import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, useMemo, useState } from "react";
import { api } from "@/lib/api";

const categoriesQuery = () =>
  queryOptions({ queryKey: ["categories"], queryFn: () => api.getCategories() });
const imagesQuery = () =>
  queryOptions({
    queryKey: ["portfolio", "all"],
    queryFn: () => api.getPortfolioImages(),
  });

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Siri Photography" },
      {
        name: "description",
        content:
          "Selected weddings, portraits and editorial work from the Siri Photography archive.",
      },
      { property: "og:title", content: "Portfolio — Siri Photography" },
      {
        property: "og:description",
        content: "Selected weddings, portraits and editorial work.",
      },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(categoriesQuery());
    context.queryClient.ensureQueryData(imagesQuery());
  },
  component: PortfolioPage,
});

function PortfolioPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-24 pt-32 md:pt-40">
      <header className="mb-16 max-w-3xl">
        <p className="text-[10px] uppercase tracking-[0.4em] text-primary">
          ✱ The archive
        </p>
        <h1 className="mt-4 font-display text-6xl font-bold leading-[0.9] tracking-tight md:text-8xl">
          Portfolio
        </h1>
      </header>
      <Suspense
        fallback={<p className="text-sm text-muted-foreground">Loading…</p>}
      >
        <Gallery />
      </Suspense>
    </div>
  );
}

function Gallery() {
  const { data: categories } = useSuspenseQuery(categoriesQuery());
  const { data: images } = useSuspenseQuery(imagesQuery());
  const [active, setActive] = useState<number | "all">("all");

  const activeCategories = useMemo(
    () => categories.filter((c) => c.is_active !== false),
    [categories],
  );
  const categoryMap = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories],
  );
  const visibleImages = useMemo(
    () =>
      images.filter((i) => {
        const category = categoryMap.get(i.category_id);
        return i.is_active !== false && category?.is_active !== false;
      }),
    [images, categoryMap],
  );

  const filtered = useMemo(
    () =>
      active === "all"
        ? visibleImages
        : visibleImages.filter((i) => i.category_id === active),
    [active, visibleImages],
  );

  return (
    <>
      <div className="mb-10 flex flex-wrap gap-3">
        <FilterChip active={active === "all"} onClick={() => setActive("all")}>
          All
        </FilterChip>
        {activeCategories.map((c) => (
          <FilterChip
            key={c.id}
            active={active === c.id}
            onClick={() => setActive(c.id)}
          >
            {c.name}
          </FilterChip>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          No images in this collection yet.
        </p>
      ) : (
        <div className="columns-1 gap-4 sm:columns-2 md:columns-3 [&>*]:mb-4">
          {filtered.map((img) => (
            <figure
              key={img.id}
              className="break-inside-avoid overflow-hidden rounded-sm bg-muted shadow-sm"
            >
              <img
                src={img.image_url}
                alt={img.caption ?? "Portfolio image"}
                loading="lazy"
                className="w-full transition-transform duration-700 hover:scale-[1.03]"
              />
              {img.caption && (
                <figcaption className="px-3 py-3 text-xs text-muted-foreground">
                  {img.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      )}
    </>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.2em] transition-colors " +
        (active
          ? "border-foreground bg-foreground text-background"
          : "border-border text-muted-foreground hover:text-foreground")
      }
    >
      {children}
    </button>
  );
}