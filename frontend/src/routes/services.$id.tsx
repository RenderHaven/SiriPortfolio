import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { formatPrice, useCart } from "@/lib/cart";

const serviceQuery = (id: string) =>
  queryOptions({
    queryKey: ["service", id],
    queryFn: () => api.getService(id),
  });

export const Route = createFileRoute("/services/$id")({
  loader: ({ context, params }) => {
    context.queryClient.ensureQueryData(serviceQuery(params.id));
  },
  component: ServiceDetail,
});

function ServiceDetail() {
  const { id } = Route.useParams();
  const { data: service } = useSuspenseQuery(serviceQuery(id));
  const { add, items } = useCart();
  const inCart = items.some((i) => i.serviceId === service.id);
  const includes = Array.isArray(service.includes)
    ? service.includes
    : service.includes
      ? String(service.includes)
          .split(/[\n,•]/)
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 md:py-20">
      <Link
        to="/services"
        className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground"
      >
        ← All services
      </Link>
      <div className="mt-8 grid gap-12 md:grid-cols-2">
        <div className="aspect-[4/5] overflow-hidden bg-muted">
          {service.image_url && (
            <img
              src={service.image_url}
              alt={service.title}
              className="h-full w-full object-cover"
            />
          )}
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.4em] text-primary">
            Package
          </p>
          <h1 className="mt-3 font-display text-5xl">{service.title}</h1>
          <p className="mt-6 leading-relaxed text-muted-foreground">
            {service.description}
          </p>
          {includes.length > 0 && (
            <div className="mt-8">
              <p className="text-[10px] uppercase tracking-[0.3em] text-foreground">
                Includes
              </p>
              <ul className="mt-4 space-y-2 text-sm text-foreground/80">
                {includes.map((line, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-2 inline-block h-px w-4 bg-primary" />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-10 flex items-end justify-between border-t border-border pt-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Starting at
              </p>
              <p className="font-display text-3xl">
                {formatPrice(Number(service.price))}
              </p>
            </div>
            <button
              onClick={() => {
                add(service);
                toast.success(`${service.title} added to enquiry`);
              }}
              disabled={inCart}
              className="rounded-sm bg-foreground px-6 py-3 text-xs uppercase tracking-[0.25em] text-background hover:bg-primary disabled:cursor-not-allowed disabled:bg-muted-foreground"
            >
              {inCart ? "Added" : "Add to enquiry"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}