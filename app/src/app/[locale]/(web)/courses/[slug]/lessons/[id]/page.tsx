import type { ReactNode } from "react";
import { LessonView } from "./lesson-view";

type Props = { params: Promise<{ slug: string; id: string }> };

export default async function LessonPage({ params }: Props): Promise<ReactNode> {
  const { slug, id } = await params;
  return <LessonView course_slug={slug} lesson_id={id} />;
}
