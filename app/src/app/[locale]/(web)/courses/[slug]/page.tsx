import type { ReactNode } from "react";

type Props = { params: Promise<{ slug: string }> };

export default async function CourseSlugPage({ params }: Props): Promise<ReactNode> {
  const { slug } = await params;
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-semibold">Course: {slug}</h1>
      <p className="mt-2 text-muted-foreground">Course detail and modules</p>
    </div>
  );
}
