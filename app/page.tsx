"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Home } from "lucide-react";
import Link from "next/link";
import { Layout } from "@/components/layout/Layout"; // ← ĐÃ SỬA: dùng named import
import PropertyCard from "@/components/PropertyCard";
import NewsCard from "@/components/NewsCard";
import AreaCard from "@/components/AreaCard";
import SearchAutocomplete from "@/components/SearchAutocomplete";
import { Button } from "@/components/ui/button";

import { mockProperties } from "../data/mockProperties";
import { mockAreas } from "../data/mockAreas";
import { mockNews } from "../data/mockNews";

const QUICK_DISTRICTS = [
  { label: "Thanh Xuân", value: "thanh-xuan" },
  { label: "Đống Đa", value: "dong-da" },
  { label: "Cầu Giấy", value: "cau-giay" },
  { label: "Ba Đình", value: "ba-dinh" },
  { label: "Hà Đông", value: "ha-dong" },
  { label: "Hai Bà Trưng", value: "hai-ba-trung" },
];

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleDistrictClick = (district: string) => {
    router.push(`/nha-dat-ban?district=${district}`);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/nha-dat-ban?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleAutocompleteSelect = (
    type: "district" | "propertyType",
    value: string
  ) => {
    if (type === "district") {
      router.push(`/nha-dat-ban?district=${value}`);
    } else {
      router.push(`/nha-dat-ban?propertyType=${value}`);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="gradient-hero py-12 md:py-20">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
              Tìm kiếm nhà đất
              <br />
              <span className="text-primary-foreground/90">
                dễ dàng & nhanh chóng
              </span>
            </h1>
            <p className="text-primary-foreground/80 text-base md:text-lg mb-8">
              Hơn 50,000 tin đăng mới mỗi tháng. Kết nối trực tiếp với chủ nhà.
            </p>

            {/* Search box */}
            <div className="bg-card rounded-xl p-4 md:p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <span className="filter-chip active flex items-center gap-1.5">
                  <Home className="w-4 h-4" />
                  Nhà đất bán
                </span>
              </div>

              <div className="flex flex-col md:flex-row gap-3">
                <SearchAutocomplete
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSelect={handleAutocompleteSelect}
                  onKeyDown={handleKeyDown}
                  placeholder="Nhập địa điểm, quận/huyện, loại nhà..."
                />

                <Button
                  size="lg"
                  className="md:w-auto"
                  onClick={handleSearch}
                  disabled={!searchQuery.trim()}
                >
                  <Search className="w-5 h-5 mr-2" />
                  Tìm kiếm
                </Button>
              </div>

              <div className="flex items-center gap-2 mt-4 overflow-x-auto scrollbar-hide pb-1">
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  Tìm nhanh:
                </span>
                <div className="flex gap-2">
                  {QUICK_DISTRICTS.map((district) => (
                    <button
                      key={district.value}
                      onClick={() => handleDistrictClick(district.value)}
                      className="filter-chip whitespace-nowrap hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {district.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {[
                { label: "Tin đăng", value: "50K+" },
                { label: "Người dùng", value: "1M+" },
                { label: "Dự án", value: "500+" },
                { label: "Khu vực", value: "63" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-primary-foreground">
                    {stat.value}
                  </p>
                  <p className="text-primary-foreground/70 text-sm">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Listing mới */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title mb-0">Tin đăng mới nhất</h2>
            <Link
              href="/nha-dat-ban"
              className="text-primary font-medium text-sm flex items-center gap-1 hover:underline"
            >
              Xem tất cả <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {mockProperties.slice(0, 8).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* Khu vực nổi bật */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title mb-0">Khu vực nổi bật</h2>
            <Link
              href="/nha-dat-ban"
              className="text-primary font-medium text-sm flex items-center gap-1 hover:underline"
            >
              Xem tất cả <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {mockAreas.map((area) => (
              <AreaCard key={area.id} area={area} />
            ))}
          </div>
        </div>
      </section>

      {/* Tin tức */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title mb-0">Tin tức bất động sản</h2>
            <Link
              href="/tin-tuc"
              className="text-primary font-medium text-sm flex items-center gap-1 hover:underline"
            >
              Xem tất cả <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="md:col-span-2 lg:col-span-1 lg:row-span-2">
              <NewsCard news={mockNews[0]} variant="featured" />
            </div>
            {mockNews.slice(1, 5).map((news) => (
              <NewsCard key={news.id} news={news} variant="horizontal" />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
