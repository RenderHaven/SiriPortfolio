import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { toast } from "sonner";
import { api, type Service } from "@/lib/api";
import { formatPrice, useCart } from "@/lib/cart";

const servicesQuery = () =>
  queryOptions({ queryKey: ["services"], queryFn: () => api.getServices() });

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services & Packages — Siri Photography" },
      {
        name: "description",
        content:
          "Wedding, portrait and editorial photography packages from Siri Photography.",
      },
      { property: "og:title", content: "Services — Siri Photography" },
      {
        property: "og:description",
        content: "Wedding, portrait and editorial photography packages.",
      },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(servicesQuery());
  },
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-24 pt-32 md:pt-40">
      <header className="mb-16 max-w-3xl">
        <p className="text-[10px] uppercase tracking-[0.4em] text-primary">
          ✱ Packages
        </p>
        <h1 className="mt-4 font-display text-6xl font-bold leading-[0.9] tracking-tight md:text-8xl">
          Crafted for the day,
          <br />
          <span className="italic text-stroke">kept for a lifetime.</span>
        </h1>
        <p className="mt-6 max-w-lg text-muted-foreground">
          Choose a starting point — we tailor each engagement to your venue,
          hours and the people you want remembered.
        </p>
      </header>
      <Suspense
        fallback={<p className="text-sm text-muted-foreground">Loading…</p>}
      >
        <ServiceGrid />
      </Suspense>
    </div>
  );
}

function ServiceGrid() {
  const { data } = useSuspenseQuery(servicesQuery());
  const services = data.filter((s) => s.is_active !== false);
  if (!services.length)
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        Packages will appear here soon.
      </p>
    );
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {services.map((s) => (
        <ServiceCard key={s.id} service={s} />
      ))}
    </div>
  );
}

function ServiceCard({ service }: { service: Service }) {
  const { add, items } = useCart();
  const inCart = items.some((i) => i.serviceId === service.id);
  const includes = normalizeIncludes(service.includes);

  return (
    <article className="group flex flex-col border border-border bg-card transition-shadow hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.18)]">
      {service.image_url && (
        <div className="aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={service.image_url}
            alt={service.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-2xl">{service.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {service.description}
        </p>
        {includes.length > 0 && (
          <ul className="mt-5 space-y-1.5 text-sm text-foreground/80">
            {includes.slice(0, 5).map((line, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-1.5 inline-block h-px w-3 bg-primary" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6 flex items-end justify-between border-t border-border pt-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Starting at
            </p>
            <p className="font-display text-2xl text-foreground">
              {formatPrice(Number(service.price))}
            </p>
          </div>
          <button
            onClick={() => {
              add(service);
              toast.success(`${service.title} added to enquiry`);
            }}
            disabled={inCart}
            className="rounded-sm border border-foreground px-4 py-2 text-[11px] uppercase tracking-[0.25em] text-foreground transition-colors hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:border-muted-foreground disabled:text-muted-foreground disabled:hover:bg-transparent"
          >
            {inCart ? "Added" : "Add"}
          </button>
        </div>
        <Link
          to="/services/$id"
          params={{ id: String(service.id) }}
          className="mt-4 text-[11px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground"
        >
          View details →
        </Link>
      </div>
    </article>
  );
}

function normalizeIncludes(v: Service["includes"]): string[] {
  if (!v) return [];
  if (Array.isArray(v)) return v.filter(Boolean) as string[];
  return String(v)
    .split(/[\n,•]/)
    .map((s) => s.trim())
    .filter(Boolean);
}