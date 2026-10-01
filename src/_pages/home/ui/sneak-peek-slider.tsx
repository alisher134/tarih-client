"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";

export function SneakPeekSlider() {
  const [activeSlide, setActiveSlide] = useState(0);
  const t = useTranslations("home.sneakPeek.slider");

  const slides = [
    {
      id: "dashboard",
      label: t("dashboard.tab"),
      image: "/screenshots/dashboard.png",
      alt: "Dashboard View",
    },
    {
      id: "test",
      label: t("test.tab"),
      image: "/screenshots/test.png",
      alt: "Test taking View",
    },
    {
      id: "analytics",
      label: t("analytics.tab"),
      image: "/screenshots/analytics.png",
      alt: "Analytics View",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="space-y-8">
      {/* Navigation Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => setActiveSlide(index)}
            className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
              activeSlide === index
                ? "bg-primary text-primary-foreground shadow-md scale-105"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {slide.label}
          </button>
        ))}
      </div>

      <div className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-border/80 bg-background shadow-2xl">
        {/* Browser Header */}
        <div className="flex h-12 items-center border-b border-border/80 bg-muted/30 px-4">
          <div className="flex gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500/80" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <div className="h-3 w-3 rounded-full bg-green-500/80" />
          </div>
          <div className="mx-auto flex h-6 w-1/2 items-center justify-center rounded-md bg-background/80 text-[10px] text-muted-foreground shadow-sm">
            app.tarih.kz / {slides[activeSlide].id}
          </div>
        </div>

        {/* Content Wrapper */}
        <div className="relative aspect-[16/10] w-full sm:aspect-[16/9] bg-muted/20">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                activeSlide === index
                  ? "opacity-100 z-10"
                  : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* Replace with your actual screenshots. 
                  Make sure they are placed in public/screenshots/ */}
              <div className="flex h-full w-full items-center justify-center bg-muted/10 text-muted-foreground flex-col gap-4">
                <span className="text-sm font-medium">
                  Place screenshot here
                </span>
                <span className="text-xs font-mono">{slide.image}</span>
              </div>

              {/* Uncomment and use Image component once screenshots are in place: */}
              {/* <Image
                src={slide.image}
                alt={slide.alt}
                fill
                className="object-cover object-top sm:object-contain bg-muted"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
                priority={index === 0}
              /> */}
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-border/50" />
      </div>
    </div>
  );
}
