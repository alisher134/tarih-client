"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui/accordion";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

type FaqAccordionProps = {
  items: FaqItem[];
};

export function FaqAccordion({ items }: FaqAccordionProps) {
  return (
    <div className="w-full">
      <Accordion className="space-y-4">
        {items.map((item) => (
          <AccordionItem
            key={item.id}
            value={item.id}
            className="rounded-2xl border bg-card/50 px-6 backdrop-blur-sm transition-colors hover:bg-card"
          >
            <AccordionTrigger className="text-left font-medium hover:no-underline">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="pb-6 text-muted-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
