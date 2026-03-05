"use client";

import { useTranslations } from "next-intl";
import { useAuthStore } from "@/store/auth-store";
import { Link } from "@/i18n/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Credential = {
  name: string;
  mint: string;
  image?: string | null;
  attributes?: Record<string, string | number>;
};

const dummy_credentials: Credential[] = [
  {
    name: "Intro to Tech Completion",
    mint: "FB9LmHKu6QoZwj9ZJbYM5KcRUzgCkErSAQfQXbksNJNs",
    image: "https://cdn.sanity.io/images/18yocufb/production/18be28c9c5f90b887326e549a75543843d2cee3d-1000x584.webp",
    attributes: { "difficulty": "beginner", "xp": 500, "role": "developer" },
  },
  {
    name: "Solana Bootcamp Master",
    mint: "2NTkiDt6VgLTs8WytHU4KM9hejCU5zL1eWKyBjS9LEti",
    image: "https://cdn.sanity.io/images/18yocufb/production/1aeac19ebdb28c11e03c19b22cb7c79eeb135d94-1280x720.jpg",
    attributes: { "difficulty": "intermediate", "xp": 1200, "track": "rust" },
  }
];

const EXPLORER_BASE = "https://explorer.solana.com/address";

export default function CertificatesPage() {
  const t = useTranslations("certificates");
  const session = useAuthStore((s) => s.session);

  if (!session) return null;

  const isPending = false;
  const credentials = dummy_credentials;

  const cardClass =
    "rounded-none border-2 border-border bg-card shadow-[3px_3px_0_0_hsl(var(--foreground)_/_0.15)]";

  return (
    <div className="container mx-auto space-y-6 p-4 md:p-6">
      <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>

      {isPending && <p className="text-sm text-muted-foreground">{t("title")}…</p>}

      {!isPending && credentials.length === 0 && (
        <Card className={cardClass}>
          <CardContent className="space-y-3 p-6">
            <p className="text-muted-foreground">{t("empty")}</p>
            <Link href="/courses">
              <Button variant="outline" className="rounded-none border-2">
                {t("browseCourses")}
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {!isPending && credentials.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {credentials.map((cred) => (
            <li key={cred.mint}>
              <Link href={`/certificates/${cred.mint}`}>
                <Card className={`${cardClass} transition-colors hover:border-primary`}>
                  {cred.image && (
                    <div className="border-b-2 border-border">
                      <img
                        src={cred.image}
                        alt={cred.name}
                        className="h-40 w-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="space-y-2 p-4">
                    <h2 className="font-bold text-foreground">{cred.name}</h2>
                    {cred.attributes && (
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(cred.attributes).map(([key, val]) => (
                          <span
                            key={key}
                            className="rounded-none border border-border bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                          >
                            {key}: {val}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      mint: {cred.mint.slice(0, 8)}…{cred.mint.slice(-4)}
                    </p>
                    <a
                      href={`${EXPLORER_BASE}/${cred.mint}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-xs font-semibold text-primary underline-offset-2 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {t("viewOnExplorer")}
                    </a>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
