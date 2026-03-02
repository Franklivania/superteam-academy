import type { ReactNode } from "react";

type Props = { params: Promise<{ id: string }> };

export default async function CertificatePage({ params }: Props): Promise<ReactNode> {
  const { id } = await params;
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-semibold">Certificate: {id}</h1>
    </div>
  );
}
