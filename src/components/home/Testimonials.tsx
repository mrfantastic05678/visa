"use client";

import { BRAND } from "@/lib/constants";
import type { SanityTestimonial } from "@/lib/sanity/client";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { AE, CA, CN, DE, FR, GB, IN, IT, JP, SA, US } from "country-flag-icons/react/3x2";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";

// Small explicit map (not the full 250+ country-flag-icons barrel) — extend as
// testimonials from new countries get added in Sanity Studio. Falls back to a
// plain initial-less badge for any code not listed here.
const FLAGS: Record<string, React.ComponentType<{ className?: string; title?: string }>> = {
  AE, CA, CN, DE, FR, GB, IN, IT, JP, SA, US,
};

function initialsFrom(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function Testimonials({ testimonials }: { testimonials: SanityTestimonial[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", slidesToScroll: 1, containScroll: "trimSnaps" },
    [Autoplay({ delay: 5000, stopOnInteraction: true })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    // Subscribing to an external library (embla) — sync the initial index
    // once, then let the event listeners below handle every update after.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-16 lg:py-24 bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-10">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold font-sans mb-3">
              Testimonials
            </p>
            <h2 className="font-display font-bold text-3xl lg:text-5xl text-navy">
              Loved by travellers.
            </h2>
          </div>
          <div className="lg:text-right flex-shrink-0">
            <div className="flex lg:justify-end items-center gap-1.5">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-4 w-4 text-gold fill-gold" />
                ))}
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/google-logo.png" alt="Google" className="h-4 w-auto" />
              <span className="font-display font-bold text-navy text-lg">{BRAND.rating}</span>
            </div>
            <p className="text-xs text-muted font-sans mt-1">
              Based on {BRAND.googleReviews} reviews on Trustpilot &amp; Google
            </p>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {testimonials.map((t) => {
                const Flag = FLAGS[t.country.toUpperCase()];
                return (
                  <div
                    key={t._id}
                    className="flex-none w-[85vw] sm:w-[calc(50%-10px)] lg:w-[calc((100%-40px)/3)] mr-5 rounded-2xl border border-line bg-white p-6 flex flex-col"
                  >
                    <div className="flex mb-4">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-gold fill-gold" />
                      ))}
                    </div>
                    <p className="text-sm text-ink font-sans leading-relaxed flex-1">
                      &ldquo;{t.text}&rdquo;
                    </p>
                    <div className="mt-6 pt-5 border-t border-line flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-mist-2 grid place-items-center flex-shrink-0">
                        <span className="font-display font-bold text-xs text-navy">
                          {initialsFrom(t.name)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-sans font-semibold text-ink truncate">
                          {t.name}
                        </p>
                        <p className="text-xs font-sans text-muted flex items-center gap-1.5">
                          {Flag && <Flag className="h-3 w-4 rounded-[1px] flex-shrink-0" title={t.country} />}
                          {t.country}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Arrows */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={scrollPrev}
              className="h-10 w-10 rounded-full border border-line bg-white flex items-center justify-center hover:bg-mist transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-ink" />
            </button>

            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => emblaApi?.scrollTo(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === selectedIndex
                      ? "w-6 bg-gold"
                      : "w-2 bg-line hover:bg-muted"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={scrollNext}
              className="h-10 w-10 rounded-full border border-line bg-white flex items-center justify-center hover:bg-mist transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-ink" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
