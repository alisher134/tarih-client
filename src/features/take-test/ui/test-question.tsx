"use client";

import type { StudentQuestion } from "@/entities/course";

type TestQuestionProps = {
  question: StudentQuestion;
  selectedIds: string[];
  disabled?: boolean;
  onToggle: (optionId: string) => void;
};

export function TestQuestion({
  question,
  selectedIds,
  disabled = false,
  onToggle,
}: TestQuestionProps) {
  const inputType = question.type === "MULTIPLE_CHOICE" ? "checkbox" : "radio";
  const sortedOptions = [...question.options].sort(
    (left, right) => left.order - right.order,
  );

  return (
    <fieldset
      className="flex flex-col gap-4 rounded-xl border border-border/70 bg-card p-5 shadow-xs"
      disabled={disabled}
    >
      <legend className="px-1 text-base font-semibold">{question.text}</legend>

      <ul className="flex flex-col gap-2">
        {sortedOptions.map((option) => (
          <li key={option.id}>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 transition-colors hover:border-primary/20 hover:bg-primary/5">
              <input
                type={inputType}
                name={question.id}
                checked={selectedIds.includes(option.id)}
                onChange={() => onToggle(option.id)}
                className="size-4 cursor-pointer accent-primary"
              />
              <span>{option.text}</span>
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}
