"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageSliderProps {
  images: string[];
  alt: string;
  borderRadius?: string;
  autoPlayInterval?: number; // em milissegundos
}

export function ImageSlider({ 
  images, 
  alt, 
  borderRadius = "12",
  autoPlayInterval = 4000 // 4 segundos por padrão
}: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  // SE TIVER APENAS 1 IMAGEM, NÃO USA SLIDER
  if (images.length === 1) {
    return (
      <div className="w-full">
        <img
          src={images[0]}
          alt={alt}
          className="w-full h-auto max-h-96 object-contain"
          style={{ borderRadius: `${borderRadius}px` }}
        />
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // AUTO-PLAY: AVANÇA AUTOMATICAMENTE A CADA 4 SEGUNDOS
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      goToNext();
    }, autoPlayInterval);

    // LIMPAR INTERVAL QUANDO COMPONENTE DESMONTAR
    return () => clearInterval(interval);
  }, [currentIndex, images.length, autoPlayInterval]);

  return (
    <div className="relative w-full group">
      {/* IMAGEM ATUAL */}
      <div className="relative overflow-hidden" style={{ borderRadius: `${borderRadius}px` }}>
        <img
          src={images[currentIndex]}
          alt={`${alt} - ${currentIndex + 1}`}
          className="w-full h-auto max-h-96 object-contain bg-black/5 transition-opacity duration-500"
        />
      </div>

       {/* SETAS DE NAVEGAÇÃO */}
      {images.length > 1 && (
        <>
          {/* SETA ESQUERDA */}
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition opacity-0 group-hover:opacity-100 z-10"
            aria-label="Imagem anterior"
          >
            <ChevronLeft size={24} />
          </button>

          {/* SETA DIREITA */}
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition opacity-0 group-hover:opacity-100 z-10"
            aria-label="Próxima imagem"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )} 
      
      

      {/* INDICADORES (DOTS) 
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all ${
                index === currentIndex
                  ? "bg-white w-6 h-2"
                  : "bg-white/50 hover:bg-white/75 w-2 h-2"
              } rounded-full`}
              aria-label={`Ir para imagem ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* CONTADOR DE IMAGENS */}
      {images.length > 1 && (
        <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full font-bold z-10">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}