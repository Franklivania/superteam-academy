import { getLandingContent } from "@/lib/content";
import { LandingPageView } from "@/components/sections/landing/landing-page-view";

type PageProps = { params: Promise<{ locale: string }> };

export default async function WebPage({ params }: PageProps) {
  const { locale } = await params;
  const content = getLandingContent(locale);
  return <LandingPageView content={content} />;
}
