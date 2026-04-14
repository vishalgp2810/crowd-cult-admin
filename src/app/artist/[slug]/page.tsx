import { ArtistProfileView } from "@/components/artist/ArtistProfileView";

export default async function ArtistProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ArtistProfileView slug={slug} />;
}
