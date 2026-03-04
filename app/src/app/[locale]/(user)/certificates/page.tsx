"use client";

import { useTranslations } from "next-intl";
import { useAPIQuery } from "@/lib/api/useAPI";
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

type ProfileData = {
  credentials: Credential[];
};

const EXPLORER_BASE = "https://explorer.solana.com/address";

export default function CertificatesPage() {
  const t = useTranslations("certificates");
  const session = useAuthStore((s) => s.session);

  const { data: profile, isPending } = useAPIQuery<ProfileData>({
    queryKey: ["profile"],
    path: "/api/user/profile",
    enabled: Boolean(session),
  });

  if (!session) return null;

  const credentials = profile?.credentials ?? [];

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
