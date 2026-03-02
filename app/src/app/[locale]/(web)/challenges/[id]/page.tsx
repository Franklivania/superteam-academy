import type { ReactNode } from "react";

type Props = { params: Promise<{ id: string }> };

export default async function ChallengeIdPage({ params }: Props): Promise<ReactNode> {
  const { id } = await params;
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-semibold">Challenge: {id}</h1>
      <p className="mt-2 text-muted-foreground">Monaco editor and submit</p>
    </div>
  );
}
