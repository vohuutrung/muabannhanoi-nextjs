"use client";

import Link from "next/link";

interface AreaCardProps {
  area: {
    id: string;
    name: string;
    image: string;
    propertyCount?: number;
  };
}

export function AreaCard({ area }: AreaCardProps) {
  return (
    <Link
      href={`/nha-dat-ban?area=${area.id}`}
      className="property-card group relative overflow-hidden rounded-xl aspect-[4/3]"
    >
      <img
        src={area.image}
        alt={area.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

      <div className="absolute bottom-3 left-3 text-white">
        <h3 className="text-lg font-semibold">{area.name}</h3>

        {area.propertyCount !== undefined && (
          <p className="text-sm opacity-80">
            {area.propertyCount} tin đăng
          </p>
        )}
      </div>
    </Link>
  );
}

export default AreaCard;
