import React from "react";

export default function JsonLd({ schema }: { schema: Record<string, any> }) {
  return (
    <script
      type="application/ld+json"
      // JSON-LD must be a string.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
