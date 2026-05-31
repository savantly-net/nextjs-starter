import { cn } from "@/lib/utils";

interface RawHtmlProps {
  html: string;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

/**
 * Renders an HTML string. Use for legacy content or CMS output.
 * The "prose" class from Tailwind Typography is recommended for styling.
 */
export function RawHtml({ html, className, as: Tag = "div" }: RawHtmlProps) {
  return (
    <Tag
      className={cn(className)}
      // nosemgrep: typescript.react.security.audit.react-dangerouslysetinnerhtml.react-dangerouslysetinnerhtml -- intentional: renders trusted CMS/legacy markup only, per the doc comment above; callers must sanitize untrusted input.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
