"use client";

import { useState, useEffect } from 'react';

interface ImageToPreload {
  src: string;
}

export function useImagePreloader(images: ImageToPreload[]) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const preloadImages = async () => {
      try {
        await Promise.all(
          images.map((image) => {
            return new Promise((resolve, reject) => {
              const img = document.createElement('img');
              img.src = image.src;
              img.onload = resolve;
              img.onerror = reject;
            });
          })
        );
        setIsLoading(false);
      } catch (error) {
        console.error('Error preloading images:', error);
        setIsLoading(false);
      }
    };

    preloadImages();
  }, [images]);

  return { isLoading };
}
