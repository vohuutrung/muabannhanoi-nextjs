"use client";

import Link from "next/link";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <Layout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-background">
        <div className="container-custom">
          <div className="max-w-lg mx-auto text-center">
            <div className="relative mb-8">
              <span className="text-[150px] md:text-[200px] font-bold text-muted/50 leading-none">
                404
              </span>
              <div className="absolute inset-0 flex items-center justify-center">
                <img src="/404-icon.svg" className="w-20 h-20" />
              </div>
            </div>

            <p className="text-xl font-semibold mb-8">
              Trang bạn tìm không tồn tại!
            </p>

            <Link href="/">
              <Button>Quay lại trang chủ</Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
