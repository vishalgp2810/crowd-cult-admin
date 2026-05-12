import { VenueProfileView } from "@/components/venue/VenueProfileView";

export default async function VenueProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <VenueProfileView slug={slug} />;
}
