import type { ReactNode } from "react";
import { ChallengeDetailView } from "./challenge-detail-view";

type Props = { params: Promise<{ id: string }> };

export default async function ChallengeIdPage({ params }: Props): Promise<ReactNode> {
  const { id } = await params;
  return <ChallengeDetailView challenge_id={id} />;
}
