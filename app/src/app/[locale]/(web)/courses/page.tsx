import type { ReactNode } from "react";

export default function CoursesPage(): ReactNode {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-semibold">Courses</h1>
      <p className="mt-2 text-muted-foreground">Course list from CMS</p>
    </div>
  );
}
