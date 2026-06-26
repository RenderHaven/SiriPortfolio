import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Suspense, useMemo } from "react";
import { api } from "@/lib/api";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Siri Photography — Timeless Visual Stories" },
      {
        name: "description",
        content:
          "Siri Photography crafts quietly cinematic imagery for weddings, portraits and editorial work.",
      },
      { property: "og:title", content: "Siri Photography" },
      {
        property: "og:description",
        content:
          "Quietly cinematic photography for weddings, portraits and editorial.",
      },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(featuredQueryOptions());
    context.queryClient.ensureQueryData(categoriesQueryOptions());
  },
  component: Index,
});

function Index() {
  return (
    <div>
      <Hero />
      <Suspense fallback={null}>
        <FeaturedWork />
      </Suspense>
      <Philosophy />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative">
      <div className="grid min-h-[78vh] grid-cols-1 md:grid-cols-2">
        <div className="flex items-center px-6 py-20 md:px-16">
          <div className="max-w-md">
            <p className="mb-6 text-[11px] uppercase tracking-[0.4em] text-primary">
              Est. Siri Studio
            </p>
            <h1 className="font-display text-5xl leading-[1.05] md:text-6xl">
              Stories told in <em className="italic text-primary">light</em> &amp; stillness.
            </h1>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              Weddings, portraits and editorial photography rooted in
              warmth, quiet detail, and the kind of honesty you only
              notice on second glance.
            </p>
            <div className="mt-10 flex items-center gap-4">
              <Link
                to="/portfolio"
                className="inline-flex items-center justify-center rounded-sm bg-foreground px-6 py-3 text-xs uppercase tracking-[0.25em] text-background transition-colors hover:bg-primary"
              >
                View portfolio
              </Link>
              <Link
                to="/contact"
                className="text-xs uppercase tracking-[0.25em] text-foreground underline-offset-8 hover:underline"
              >
                Enquire →
              </Link>
            </div>
          </div>
        </div>
        <div className="relative h-full min-h-[60vh] overflow-hidden">
          <img
            src={heroImg}
            alt="Bride walking through golden corridor"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

const categoriesQueryOptions = () =>
  queryOptions({
    queryKey: ["categories"],
    queryFn: () => api.getCategories(),
  });

const featuredQueryOptions = () =>
  queryOptions({
    queryKey: ["portfolio", "featured"],
    queryFn: () => api.getPortfolioImages(),
  });

function FeaturedWork() {
  const { data: categories } = useSuspenseQuery(categoriesQueryOptions());
  const { data } = useSuspenseQuery(featuredQueryOptions());
  const categoryMap = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories],
  );
  const images = useMemo(
    () =>
      data
        .filter((img) => {
          const category = categoryMap.get(img.category_id);
          return img.is_active !== false && category?.is_active !== false;
        })
        .slice(0, 6),
    [data, categoryMap],
  );
  if (!images.length) return null;
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-12 flex items-end justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.4em] text-primary">
            Selected work
          </p>
          <h2 className="mt-2 font-display text-4xl">Recent frames</h2>
        </div>
        <Link
          to="/portfolio"
          className="hidden text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground md:inline"
        >
          All work →
        </Link>
      </div>
      <div className="columns-1 gap-5 sm:columns-2 [&>*]:mb-5">
        {images.map((img) => (
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
    </section>
  );
}

function Philosophy() {
  return (
    <section className="border-t border-border/60 bg-secondary/40">
      <div className="mx-auto grid max-w-5xl gap-12 px-6 py-24 md:grid-cols-2">
        <h2 className="font-display text-4xl leading-tight">
          A slower craft. <br />
          <em className="italic text-primary">Made to be kept.</em>
        </h2>
        <p className="text-base leading-relaxed text-muted-foreground">
          We work in small numbers — a handful of weddings each year,
          editorial commissions, and personal portraits. Every frame is
          composed with intent, processed by hand, and delivered as
          something you'll revisit decades from now. No filters that
          age, no trends that fade. Just light, time, and patience.
        </p>
      </div>
    </section>
  );
}
