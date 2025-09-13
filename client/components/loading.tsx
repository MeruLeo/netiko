"use client";

import { useLoadingStore } from "@/stores/loading";
import { Spinner } from "@heroui/spinner";

export default function Loading() {
  const loading = useLoadingStore((state) => state.loading);

  if (!loading) return null;

  return <Spinner />;
}
