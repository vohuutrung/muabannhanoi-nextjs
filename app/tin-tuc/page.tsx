"use client";

import { useState } from "react";
import Link from "next/link";
import { Layout } from "@/components/layout/Layout";
import { NewsCard } from "@/components/NewsCard";
import { mockNews } from "@/data/mockData";
import { cn } from "@/lib/utils";

const categories = [
  "Tất cả",
  "Thị trường",
  "Dự án mới",
  "Tài chính",
  "Phong cách sống",
  "Hướng dẫn",
  "Thiết kế",
];

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState("Tất cả");

  return (
    <Layout>
      <div className="bg-secondary border-b border-border">
        <div className="container-custom py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/"
              className="text-muted-foreground hover:text-primary"
            >
              Trang chủ
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">Tin tức</span>
          </div>
        </div>
      </div>

      <div className="bg-background">
        <div className="container-custom py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Tin tức bất động sản
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Cập nhật những thông tin mới nhất về thị trường, dự án và xu hướng
              bất động sản Việt Nam.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "filter-chip",
                  activeCategory === category && "active"
                )}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="mb-8">
            <NewsCard news={mockNews[0]} variant="featured" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockNews.slice(1).map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
