"use client";

import { ReactNode } from "react";
import { FavoritesProvider } from "@/hooks/useFavorites";
import { AuthProvider } from "@/hooks/useAuth";

// Nếu bạn có thêm UI Provider (Toaster, Tooltip…)
// thì import vào đây, VD:
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <FavoritesProvider>
        {/* Nếu bạn dùng Tooltip trong dự án */}
        {/* <TooltipProvider> */}

          {/* Nếu bạn dùng Toaster (thông báo) */}
          {/* <Toaster /> */}

          {children}

        {/* </TooltipProvider> */}
      </FavoritesProvider>
    </AuthProvider>
  );
}
