"use client";

import { PortableText, type PortableTextReactComponents } from "@portabletext/react";

const components: Partial<PortableTextReactComponents> = {
  block: {
    h1: ({ children }) => (
      <h1 className="mt-6 mb-3 text-2xl font-bold text-foreground">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="mt-5 mb-2 text-xl font-bold text-foreground">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-4 mb-2 text-lg font-semibold text-foreground">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-3 mb-1 text-base font-semibold text-foreground">{children}</h4>
    ),
    normal: ({ children }) => (
      <p className="mb-3 leading-relaxed text-muted-foreground">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-4 border-l-4 border-primary/40 pl-4 italic text-muted-foreground">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => <span className="underline">{children}</span>,
    code: ({ children }) => (
      <code className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-sm text-primary">
        {children}
      </code>
    ),
    link: ({ value, children }) => {
      const href = value?.href ?? "#";
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline decoration-primary/40 underline-offset-2 transition-colors hover:text-primary/80"
        >
          {children}
        </a>
      );
    },
  },
  list: {
    bullet: ({ children }) => <ul className="my-3 ml-5 list-disc space-y-1">{children}</ul>,
    number: ({ children }) => <ol className="my-3 ml-5 list-decimal space-y-1">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="text-muted-foreground">{children}</li>,
    number: ({ children }) => <li className="text-muted-foreground">{children}</li>,
  },
  types: {
    image: ({ value }) => {
      const url = value?.asset?.url ?? value?.asset?._ref;
      if (!url) return null;
      return (
        <figure className="my-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt={value?.alt ?? ""} className="w-full rounded-none border-2 border-border" />
          {value?.caption && (
            <figcaption className="mt-1 text-xs text-muted-foreground">{value.caption}</figcaption>
          )}
        </figure>
      );
    },
    video: ({ value }) => (
      <div className="my-4">
        {value?.title && <p className="mb-1 text-sm font-medium text-foreground">{value.title}</p>}
        {value?.url && (
          <a
            href={value.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary underline"
          >
            ▶ Watch video
          </a>
        )}
      </div>
    ),
    codeBlock: ({ value }) => (
      <pre className="my-4 overflow-x-auto rounded-none border-2 border-border bg-muted p-4 font-mono text-sm text-foreground">
        {value?.description && (
          <span className="mb-2 block text-xs text-muted-foreground">{value.description}</span>
        )}
        <code>{value?.code ?? ""}</code>
      </pre>
    ),
    link: ({ value }) => (
      <a
        href={value?.url ?? "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="my-2 inline-block text-sm text-primary underline"
      >
        {value?.label ?? value?.url ?? "Link"}
      </a>
    ),
  },
};

export function CustomPortableText({ value }: { value: any }) {
  if (!value) return null;
  return <PortableText value={value} components={components} />;
}
