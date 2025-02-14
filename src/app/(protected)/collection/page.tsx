"use client";

import LoadingIndicator from "@/components/loading-indicator";
import { Routes } from "@/lib/routes";
import { usePaginatedQuery } from "convex/react";
import Image from "next/image";
import Link from "next/link";
import { api } from "../../../convex/_generated/api";

export default function CollectionPage() {
  const { results, isLoading } = usePaginatedQuery(
    api.images.getCollectionImages,
    {},
    { initialNumItems: 20 }
  );

  if (isLoading) {
    return <LoadingIndicator className="mt-40" />;
  }

  return (
    <div className="container items-center justify-center max-w-6xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {results?.map((i) => (
          <Link
            href={Routes.imagePage(i._id)}
            key={i._id}
            className="aspect-square relative overflow-hidden hover:opacity-90 transition-all"
          >
            <Image
              src={i.imageUrl}
              alt={i.title}
              fill
              className="object-cover rounded-lg transition-transform duration-300 ease-in-out hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-black bg-opacity-60 transition-all opacity-100 group-hover:opacity-100">
              <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col items-start justify-end h-full">
                <div className="flex flex-row justify-between w-full items-center">
                  <div>
                    <h3 className="text-white text-xl font-semibold mb-2 line-clamp-1">
                      <p className="text-lg">{i.title}</p>
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {!results.length && (
        <div className="text-center text-lg font-medium text-gray-400 container mx-auto max-w-(--breakpoint-lg)">
          No images in your collection yet
        </div>
      )}
    </div>
  );
}
