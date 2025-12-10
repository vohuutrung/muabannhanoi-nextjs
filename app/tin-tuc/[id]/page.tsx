"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Calendar,
  User,
  Share2,
  Facebook,
  Twitter,
  ChevronRight,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { NewsCard } from "@/components/NewsCard";
import { Button } from "@/components/ui/button";
import { mockNews } from "@/data/mockData";

export default function NewsDetailPage() {
  const params = useParams();
  const id = params.id as string | undefined;
  const news = mockNews.find((n) => n.id === id) || mockNews[0];

  return (
    <Layout>
      <div className="bg-secondary border-b border-border">
        <div className="container-custom py-3">
          <div className="flex items-center gap-2 text-sm flex-wrap">
            <Link
              href="/"
              className="text-muted-foreground hover:text-primary"
            >
              Trang chủ
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <Link
              href="/tin-tuc"
              className="text-muted-foreground hover:text-primary"
            >
              Tin tức
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground font-medium line-clamp-1">
              {news.title}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-background">
        <div className="container-custom py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded mb-4">
                {news.category}
              </span>
              <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                {news.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Admin
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {news.date}
                </span>
              </div>
            </div>

            <div className="aspect-video rounded-xl overflow-hidden mb-8">
              <img
                src={news.image}
                alt={news.title}
                className="w-full h-full object-cover"
              />
            </div>

            <article className="prose prose-lg max-w-none">
              <p className="text-lg text-muted-foreground mb-6">
                {news.excerpt}
              </p>
              {/* phần nội dung có thể giữ y nguyên hoặc viết lại theo nhu cầu */}
              <h2>Tổng quan thị trường</h2>
              <p>
                Trong năm 2024, thị trường bất động sản Việt Nam đã chứng kiến
                nhiều biến động đáng chú ý. Sự phục hồi kinh tế cùng các chính
                sách hỗ trợ đã tạo động lực tích cực cho thị trường.
              </p>
              <h2>Xu hướng nổi bật</h2>
              <ul>
                <li>Bất động sản xanh, thân thiện môi trường.</li>
                <li>Nhà thông minh, tích hợp công nghệ.</li>
                <li>Đô thị vệ tinh quanh các thành phố lớn.</li>
              </ul>
            </article>

            <div className="flex items-center gap-4 mt-8 pt-8 border-t border-border">
              <span className="text-foreground font-medium">Chia sẻ:</span>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="section-title">Bài viết liên quan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mockNews.slice(0, 3).map((item) => (
                <NewsCard key={item.id} news={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
