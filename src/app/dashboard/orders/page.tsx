"use client";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/useDebounce";
import {
  formatPrice,
  getDisplayStatus,
  getStatusColor,
  getStatusLabel,
} from "@/lib/utils";
import { RootState } from "@/redux/store";
import { getOrders } from "@/services/participant";
import { OrderRes } from "@/types/interface";
import { ArrowRight, Loader2, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

export default function OrdersPage() {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState<OrderRes[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const token = useSelector((state: RootState) => state.auth.token);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const isSearching = search !== debouncedSearch;
  const [statusShipment, setStatusShipment] = useState<string | null>(null);
  const fetchingRef = useRef(false);

  const fetchOrders = useCallback(
    async (pageNumber: number, reset = false) => {
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      if (fetchingRef.current) return;

      fetchingRef.current = true;
      try {
        const res = await getOrders(token!, {
          page: pageNumber,
          per_page: 5,
          search: debouncedSearch || undefined,
          status_shipment: statusShipment || undefined,
        });

        if (reset) {
          setOrders(res.data ?? []);
        } else {
          setOrders((prev) => [...prev, ...(res.data ?? [])]);
        }

        setHasMore(res.meta?.has_more ?? false);
      } finally {
        setLoading(false);
        setLoadingMore(false);
        fetchingRef.current = false;
      }
    },
    [token, debouncedSearch, statusShipment],
  );

  useEffect(() => {
    setOrders([]);
    setHasMore(true);
    setPage(1);

    fetchOrders(1, true);
  }, [debouncedSearch, statusShipment, fetchOrders]);

  useEffect(() => {
    if (page === 1) return;

    fetchOrders(page);
  }, [page, fetchOrders]);

  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!loadMoreRef.current) return;

    observer.current = new IntersectionObserver((entries) => {
      if (
        entries[0].isIntersecting &&
        hasMore &&
        !loading &&
        !loadingMore &&
        !fetchingRef.current
      ) {
        setPage((prev) => prev + 1);
      }
    });

    observer.current.observe(loadMoreRef.current);

    return () => observer.current?.disconnect();
  }, [hasMore, loading, loadingMore]);

  return (
    <div className="space-y-10">
      <div className="flex flex-row justify-between items-end">
        <div className="space-y-1">
          <p className="text-xs text-primary-foreground font-medium">
            ORDER HISTORY
          </p>
          <h1 className="text-3xl font-normal text-muted-foreground">
            Your recent activity
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search order no, name product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className=" border border-primary-foreground placeholder:text-primary-foreground text-primary"
            />
            {isSearching && (
              <Loader2 className="h-4 w-4 animate-spin text-primary-foreground" />
            )}
          </div>
          <Select
            value={statusShipment ?? "all"}
            onValueChange={(v) => setStatusShipment(v === "all" ? null : v)}
          >
            <SelectTrigger className="w-48 border border-primary-foreground *:data-[slot=select-value]:text-primary">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="uppercase tracking-wide text-sm">
              <SelectItem value="all">Status</SelectItem>
              <SelectItem value="pending">Awaiting Payment</SelectItem>
              <SelectItem value="process">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Completed</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              {/* <SelectItem value="cancelled">Canceled</SelectItem> */}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-6">
        {orders.map((order) => {
          const visibleItems = order.items.slice(0, 3);
          const remainingItems = order.items.length - visibleItems.length;

          return (
            <Card
              key={order.id}
              className="p-6 bg-[#F5F3F3] border-none shadow-sm"
            >
              <div className="grid grid-cols-5 gap-6 border-b pb-5 text-xs uppercase tracking-wider text-muted-foreground">
                <div>
                  <p>Order No</p>
                  <p className="mt-2 font-medium text-primary">
                    {order.order_code}
                  </p>
                </div>

                <div>
                  <p>Date</p>
                  <p className="mt-2">{order.order_date}</p>
                </div>

                <div>
                  <p>Total</p>
                  <p className="mt-2">{formatPrice(order.final_amount)}</p>
                </div>

                <div>
                  <p>Status</p>
                  <Badge
                    className={`mt-1 ${getStatusColor(getDisplayStatus(order.status, order.process_status))} border-0`}
                  >
                    {getStatusLabel(
                      getDisplayStatus(order.status, order.process_status),
                    )}
                  </Badge>
                </div>

                <div className="text-right">
                  <Link
                    href={`/orders/${order.order_code}`}
                    className="text-sm hover:underline inline-flex gap-2 items-center"
                  >
                    View Order
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-4">
                {visibleItems.map((item) => (
                  <Image
                    key={item.id}
                    src={item.image_url || "default-image.png"}
                    width={70}
                    height={90}
                    alt={item.product_name}
                    className="rounded object-cover"
                  />
                ))}

                {remainingItems > 0 && (
                  <p className="text-sm text-primary-foreground">
                    +{remainingItems} more
                  </p>
                )}
              </div>
            </Card>
          );
        })}
        <div ref={loadMoreRef} />
        {loadingMore && (
          <div className="py-6 text-center text-primary tracking-tight">
            Loading...
          </div>
        )}

        {!hasMore && orders.length > 0 && (
          <div className="py-6 text-center text-muted-foreground">
            No more orders.
          </div>
        )}
      </div>
    </div>
  );
}
