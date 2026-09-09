'use client';

import Image from 'next/image';
import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ClinicGalleryProps {
  images: string[];
  title?: string;
}

export function ClinicGallery({ images, title }: ClinicGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section className="w-full py-12 px-4 md:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        {title && (
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-2 text-foreground">
            {title}
          </h2>
        )}
        <p className="text-center text-muted-foreground mb-12">
          نگاهی به بخش‌های مختلف کلینیک ما
        </p>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {images.map((image, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg border border-border shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer bg-card aspect-video"
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image}
                alt={`تصویر کلینیک ${index + 1}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <Button
                  variant="secondary"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  نمایش بزرگتر
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for full-size image */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full max-h-96 md:max-h-screen">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-muted-foreground transition-colors"
            >
              <X size={28} />
            </button>
            <Image
              src={selectedImage}
              alt="تصویر تمام‌صفحه"
              width={1200}
              height={800}
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </section>
  );
}
