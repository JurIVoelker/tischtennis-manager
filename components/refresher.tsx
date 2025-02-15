"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const Refresher = () => {
  const { refresh } = useRouter();
  const params = useSearchParams();
  useEffect(() => {
    const isRefresh = params.get("refresh");
    if (isRefresh) {
      const url = new URL(window.location.href);
      url.searchParams.delete("refresh");
      window.history.replaceState(null, "", url.toString());
      refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, refresh]);
  return <></>;
};

export default Refresher;
