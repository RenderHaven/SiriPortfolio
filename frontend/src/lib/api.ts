const API_BASE =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "http://localhost:8000/api";

export type APIResponse<T = unknown> = {
  success: boolean;
  message?: string;
  data: T;
  errors?: unknown;
};

export type PaginatedResponse<T = unknown> = APIResponse<T[]> & {
  page: number;
  limit: number;
  total: number;
};

export type Category = {
  id: number;
  name: string;
  slug?: string;
  display_order?: number;
  is_active?: boolean;
};

export type PortfolioImage = {
  id: number;
  image_url: string;
  caption?: string | null;
  category_id: number;
  category?: Category;
  display_order?: number;
  is_active?: boolean;
};

export type Service = {
  id: number;
  title: string;
  description: string;
  includes?: string[] | string | null;
  price: number;
  image_url?: string | null;
  is_active?: boolean;
};

export type BookingPayload = {
  service_id: number;
  name: string;
  email: string;
  phone: string;
  event_name: string;
  event_date: string;
  message?: string;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const json = (await res.json().catch(() => ({}))) as APIResponse<T>;
  if (!res.ok || json.success === false) {
    throw new Error(json?.message || `Request failed: ${res.status}`);
  }
  return json.data as T;
}

export const api = {
  getCategories: () => request<Category[]>("/categories"),
  getPortfolioImages: (categoryId?: number) =>
    request<PortfolioImage[]>(
      `/portfolio/images${categoryId ? `?category_id=${categoryId}` : ""}`,
    ),
  getServices: () => request<Service[]>("/services"),
  getService: (id: number | string) => request<Service>(`/services/${id}`),
  createBooking: (payload: BookingPayload) =>
    request<{ id: number }>("/bookings/public", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};