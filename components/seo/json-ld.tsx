interface JsonLdProps {
  data: Record<string, unknown>;
}

/** Serialises a schema.org graph into a JSON-LD script tag. */
export function JsonLd({ data }: JsonLdProps): React.ReactElement {
  return (
    <script
      type="application/ld+json"
      // nosemgrep: typescript.react.security.audit.react-dangerouslysetinnerhtml.react-dangerouslysetinnerhtml -- intentional: JSON.stringify output with "<" escaped, so it cannot close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
