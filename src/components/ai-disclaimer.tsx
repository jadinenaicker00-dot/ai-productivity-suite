import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

export const DISCLAIMER_TEXT =
  "AI-generated content supports productivity but may contain inaccuracies. Users should review all outputs before use and follow company privacy policies.";

export function AiDisclaimer({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "compact";
}) {
  if (variant === "compact") {
    return (
      <p className={cn("text-xs leading-relaxed text-muted-foreground", className)}>
        {DISCLAIMER_TEXT}
      </p>
    );
  }

  return (
    <aside
      className={cn(
        "flex items-start gap-3 rounded-2xl border border-border bg-primary-soft/60 p-4",
        className,
      )}
    >
      <Info className="mt-0.5 size-4 shrink-0 text-primary-soft-foreground" aria-hidden="true" />
      <div>
        <p className="text-sm font-semibold text-primary-soft-foreground">Responsible AI</p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{DISCLAIMER_TEXT}</p>
      </div>
    </aside>
  );
}
