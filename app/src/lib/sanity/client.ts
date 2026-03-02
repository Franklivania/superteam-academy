import { createClient } from "@sanity/client";

const project_id = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_TOKEN;

export const sanity_client = createClient({
  projectId: project_id ?? "",
  dataset,
  apiVersion: "2024-01-01",
  useCdn: !token,
  ...(token ? { token } : {}),
});

export function is_sanity_configured(): boolean {
  return Boolean(project_id && dataset);
}
