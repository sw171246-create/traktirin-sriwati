import Link from "next/link";
import { notFound } from "next/navigation";
import TabCard from "@/components/TabCard";
import SupportForm from "./SupportForm";
import { getCreatorBySlug } from "@/lib/creators";
import { listSupports } from "@/lib/supportStore";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const creator = await getCreatorBySlug(slug);
  return { title: creator ? creator.name : "Kreator tidak ditemukan" };
}

export default async function CreatorPage({ params }) {
  const { slug } = await params;
  const creator = await getCreatorBySlug(slug);
  if (!creator) notFound();

  const supports = listSupports(slug);

  return (
    <div className="container stack">
      <p style={{ margin: 0 }}>
        <Link href="/#kreator">← Kembali ke daftar kreator</Link>
      </p>

      <section className="hero">
        <span className={`avatar avatar--lg tab--${creator.color ?? "orange"}`}>
          {creator.name.charAt(0)}
        </span>
        <h1 style={{ margin: "12px 0 4px" }}>{creator.name}</h1>
        <span className="pill">{creator.category}</span>
        <p>{creator.bio}</p>
      </section>

      <TabCard tab="kirim traktiran" color="orange">
        <SupportForm slug={creator.slug} creatorName={creator.name} initialSupports={supports} />
      </TabCard>
    </div>
  );
}
