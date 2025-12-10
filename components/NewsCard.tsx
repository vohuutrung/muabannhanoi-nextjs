"use client";

import Link from "next/link";

interface News {
  id: string;
  title: string;
  image: string;
  description?: string;
  date?: string;
}

interface NewsCardProps {
  news: News;
  variant?: "featured" | "default";
}

export function NewsCard({ news, variant = "default" }: NewsCardProps) {

  // FEATURED NEWS (tin nổi bật)
  if (variant === "featured") {
    return (
      <Link
        href={`/tin-tuc/${news.id}`}
        className="property-card group block"
      >
        <div className="relative aspect-[16/9] overflow-hidden rounded-t-lg">
          <img
            src={news.image}
            alt={news.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="p-3">
          <h3 className="font-semibold text-base line-clamp-2 group-hover:text-primary transition-colors">
            {news.title}
          </h3>

          {news.date && (
            <p className="text-xs text-muted-foreground mt-1">{news.date}</p>
          )}

          {news.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
              {news.description}
            </p>
          )}
        </div>
      </Link>
    );
  }

  // DEFAULT VERSION
  return (
    <Link
      href={`/tin-tuc/${news.id}`}
      className="block rounded-lg overflow-hidden border bg-card hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={news.image}
          alt={news.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
          {news.title}
        </h3>

        {news.date && (
          <p className="text-xs text-muted-foreground mt-1">{news.date}</p>
        )}
      </div>
    </Link>
  );
}

export default NewsCard;
