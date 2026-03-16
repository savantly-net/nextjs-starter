import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

interface ResponsiveImageProps extends Omit<ImageProps, "alt"> {
  alt: string;
  aspectRatio?: string;
}

/**
 * Wrapper around next/image that simplifies common patterns.
 * Uses fill mode by default with a container div for responsive sizing.
 * Pass explicit width/height to use sized mode instead.
 */
export function ResponsiveImage({
  alt,
  className,
  aspectRatio = "16/9",
  width,
  height,
  ...props
}: ResponsiveImageProps) {
  // If width and height are provided, render in sized mode
  if (width && height) {
    return (
      <Image
        alt={alt}
        width={width}
        height={height}
        className={cn(className)}
        {...props}
      />
    );
  }

  // Otherwise render in fill mode with aspect ratio container
  return (
    <div className={cn("relative overflow-hidden", className)} style={{ aspectRatio }}>
      <Image
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        {...props}
      />
    </div>
  );
}
