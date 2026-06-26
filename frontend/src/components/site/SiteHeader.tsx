import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";

const nav = [
  { to: "/", label: "Home" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link to="/" className="group flex items-baseline gap-2">
          <span className="font-display text-2xl tracking-wide text-foreground">
            Siri
          </span>
          <span className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground group-hover:text-primary">
            Photography
          </span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-xs uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <Link
          to="/cart"
          className="relative inline-flex items-center gap-2 text-sm text-foreground hover:text-primary"
        >
          <ShoppingBag className="h-5 w-5" />
          {count > 0 && (
            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              {count}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl">Siri Photography</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Quiet, timeless imagery for weddings, portraits & editorial.
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          <p className="mb-2 text-xs uppercase tracking-[0.25em] text-foreground">
            Studio
          </p>
          <p>hello@siriphotography.in</p>
          <p>+91 00000 00000</p>
        </div>
        <div className="text-sm text-muted-foreground">
          <p className="mb-2 text-xs uppercase tracking-[0.25em] text-foreground">
            Explore
          </p>
          <div className="flex flex-col gap-1">
            <Link to="/portfolio" className="hover:text-foreground">Portfolio</Link>
            <Link to="/services" className="hover:text-foreground">Services</Link>
            <Link to="/contact" className="hover:text-foreground">Contact</Link>
          </div>
        </div>
      </div>
      <p className="border-t border-border/60 py-6 text-center text-xs tracking-widest text-muted-foreground">
        © {new Date().getFullYear()} SIRI PHOTOGRAPHY
      </p>
    </footer>
  );
}