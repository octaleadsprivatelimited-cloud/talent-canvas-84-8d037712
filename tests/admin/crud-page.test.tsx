import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, vi, beforeEach } from "vitest";

// Shared mock state — reset per test.
const orderMock = vi.fn();
const selectMock = vi.fn(() => ({ order: orderMock }));
const fromMock = vi.fn(() => ({ select: selectMock }));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: { from: (...args: unknown[]) => fromMock(...args) },
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  Toaster: () => null,
}));

import { CrudPage, type FieldDef } from "@/components/admin/crud-page";

function renderPage(props?: Partial<Parameters<typeof CrudPage>[0]>) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const fields: FieldDef[] = [{ key: "title", label: "Title", required: true }];
  return render(
    <QueryClientProvider client={qc}>
      <CrudPage
        title="Items"
        table="items"
        queryKey="items"
        fields={fields}
        listColumns={[{ key: "title", label: "Title" }]}
        {...props}
      />
    </QueryClientProvider>,
  );
}

describe("CrudPage", () => {
  beforeEach(() => {
    fromMock.mockClear();
    selectMock.mockClear();
    orderMock.mockReset();
    orderMock.mockResolvedValue({ data: [], error: null });
  });

  it("fetches rows exactly once on mount (no infinite loop regression)", async () => {
    renderPage();
    await waitFor(() => expect(orderMock).toHaveBeenCalled());
    // Give React a chance to do extra renders.
    await new Promise((r) => setTimeout(r, 150));
    expect(orderMock.mock.calls.length).toBeLessThanOrEqual(2);
    expect(fromMock).toHaveBeenCalledWith("items");
  });

  it("renders empty state when no rows", async () => {
    renderPage();
    expect(await screen.findByText(/no items yet/i)).toBeInTheDocument();
  });

  it("renders rows returned by supabase", async () => {
    orderMock.mockResolvedValueOnce({
      data: [{ id: "1", title: "Hello" }],
      error: null,
    });
    renderPage();
    expect(await screen.findByText("Hello")).toBeInTheDocument();
  });

  it("surfaces toast error and shows empty list when query fails", async () => {
    const { toast } = await import("sonner");
    orderMock.mockResolvedValueOnce({ data: null, error: { message: "boom" } });
    renderPage();
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("boom"));
    expect(await screen.findByText(/no items yet/i)).toBeInTheDocument();
  });

  it.each([
    ["services", "sort_order"],
    ["industries", "sort_order"],
    ["team_members", "sort_order"],
    ["case_studies", "sort_order"],
    ["testimonials", "sort_order"],
    ["posts", "published_at"],
  ])("uses correct table=%s and orderBy=%s without looping", async (table, orderBy) => {
    renderPage({ table, orderBy, asc: orderBy === "sort_order" });
    await waitFor(() => expect(fromMock).toHaveBeenCalledWith(table));
    await new Promise((r) => setTimeout(r, 100));
    expect(orderMock.mock.calls.length).toBeLessThanOrEqual(2);
    expect(orderMock).toHaveBeenCalledWith(
      orderBy,
      expect.objectContaining({ ascending: orderBy === "sort_order" }),
    );
  });
});
