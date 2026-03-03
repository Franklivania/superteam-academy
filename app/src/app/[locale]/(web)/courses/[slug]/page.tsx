import type { ReactNode } from "react";
import { CourseDetailView } from "./course-detail-view";

type Props = { params: Promise<{ slug: string }> };

export default async function CourseSlugPage({ params }: Props): Promise<ReactNode> {
  const { slug } = await params;
  return <CourseDetailView slug={slug} />;
}
