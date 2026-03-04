"use client";

import { useTranslations } from "next-intl";
import { useAPIQuery } from "@/lib/api/useAPI";
import { useAuthStore } from "@/store/auth-store";
import { Link } from "@/i18n/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";

type Credential = {
  name: string;
  mint: string;
  image?: string | null;
  attributes?: Record<string, string | number>;
};

type ProfileData = {
  name: string | null;
  email: string;
  credentials: Credential[];
};

const EXPLORER_BASE = "https://explorer.solana.com/address";

function formatDate(): string {
  return new Date().toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function CertificateDetailContent({ id }: { id: string }) {
  const t = useTranslations("certificates");
  const session = useAuthStore((s) => s.session);

  const { data: profile, isPending } = useAPIQuery<ProfileData>({
    queryKey: ["profile"],
    path: "/api/user/profile",
    enabled: Boolean(session),
  });

  if (!session) return null;

  const credential = profile?.credentials?.find((c) => c.mint === id);

  const cardClass =
    "rounded-none border-2 border-border bg-card shadow-[3px_3px_0_0_hsl(var(--foreground)_/_0.15)]";

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: credential?.name ?? t("title"),
          text: `${t("title")}: ${credential?.name}`,
          url: window.location.href,
        });
      } catch {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleDownload = () => {
    window.print();
  };

  if (isPending) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <p className="text-sm text-muted-foreground">{t("title")}…</p>
      </div>
    );
  }

  if (!credential) {
    return (
      <div className="container mx-auto space-y-4 p-4 md:p-6">
        <p className="text-destructive">{t("notFound")}</p>
        <Link href="/certificates">
          <Button variant="outline" className="rounded-none border-2">
            {t("title")}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 p-4 md:p-6">
      <Link href="/certificates">
        <Button variant="outline" size="sm" className="rounded-none border-2">
          ← {t("title")}
        </Button>
      </Link>

      {/* Certificate Card - optimized for print */}
      <Card className={`${cardClass} print:border print:shadow-none`} id="certificate-card">
        <CardContent className="space-y-6 p-8">
          {/* Header */}
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              {t("certificateOf")}
            </p>
            <h1 className="mt-2 text-3xl font-bold text-foreground">
              {credential.name}
            </h1>
          </div>

          {/* Image */}
          {credential.image && (
            <div className="mx-auto max-w-md">
              <img
                src={credential.image}
                alt={credential.name}
                className="h-64 w-full rounded-none border-2 border-border object-cover"
              />
            </div>
          )}

          {/* Recipient */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">{t("awardedTo")}</p>
            <p className="mt-1 text-xl font-bold text-foreground">
              {profile?.name ?? profile?.email ?? "—"}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {formatDate()}
            </p>
          </div>

          {/* Attributes */}
          {credential.attributes && Object.keys(credential.attributes).length > 0 && (
            <div className="mx-auto max-w-md">
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(credential.attributes).map(([key, val]) => (
                  <div key={key} className="rounded-none border-2 border-border bg-muted p-3 text-center">
                    <p className="text-xs font-semibold uppercase text-muted-foreground">{key}</p>
                    <p className="text-lg font-bold text-foreground">{val}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* On-chain Info */}
          <div className="border-t-2 border-border pt-4 text-center">
            <p className="text-xs text-muted-foreground">{t("mintAddress")}</p>
            <p className="mt-1 break-all font-mono text-xs text-foreground">
              {credential.mint}
            </p>
            <a
              href={`${EXPLORER_BASE}/${credential.mint}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm font-semibold text-primary underline-offset-2 hover:underline"
            >
              {t("viewOnExplorer")}
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Actions - hidden in print */}
      <div className="flex gap-3 print:hidden">
        <Button
          onClick={handleShare}
          className="rounded-none border-2 border-foreground"
        >
          {t("share")}
        </Button>
        <Button
          variant="outline"
          onClick={handleDownload}
          className="rounded-none border-2"
        >
          {t("download")}
        </Button>
      </div>
    </div>
  );
}

export default function CertificateDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";
  return <CertificateDetailContent id={id} />;
}
