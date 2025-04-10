import Fallback from "@/components/common/Fallback";
import { getBlogsById } from "@/utils/api";
import { generateImageUrl } from "@/utils/generateImageUrl";
import { Metadata } from "next";
import React, { Suspense } from "react";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const _id = resolvedParams?.id;
  const res = await getBlogsById(_id);
  const data = res?.data?.data;
  if (data) {
    return {
      title: `${data?.title} | Map My Property`,
      description: data?.subtitle || "Explore your perfect property.",
      openGraph: {
        title: `${data?.title} | Map My Property`,
        description: data?.subtitle || "Explore your perfect property.",
        url: `https://www.mapmyproperty.in/blogs/${_id}`,
        siteName: "Map My Property",
        images: [
          {
            url: generateImageUrl(data?.image),
            width: 1200,
            height: 630,
            alt: "Map My Property Logo",
          },
        ],
        locale: "en_US",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${data?.title} | Map My Property`,
        description: data?.subtitle || "Explore your perfect property.",
        creator: "@mapmyproperty",
        images: [generateImageUrl(data?.image)],
      },
      alternates: {
        canonical: `https://www.mapmyproperty.in/blogs/${_id}`,
      },
    };
  }

  return {
    title: "Blog Not Found | Map My Property",
    description: "The requested blog could not be found.",
  };
}

const page = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <main className="min-h-screen">
      <Suspense fallback={<Fallback />}>{children}</Suspense>
    </main>
  );
};

export default page;
