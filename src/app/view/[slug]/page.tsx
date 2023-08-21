import { prisma } from "@/app/db";
import React from "react";
import testData from "../../../../public/data.json";

import dynamic from "next/dynamic";

const D3test = dynamic(() => import("../../../components/D3test"), {
  ssr: false,
});

export default async function page({ params }: { params: { slug: string } }) {
  const clusterData = await prisma.cluster.findMany({
    where: {
      url: params.slug,
    },
    include: {
      lynks: true,
      relatedClusters: {
        include: {
          relatedClusters: true,
          lynks: true,
        },
      },
    },
  });
  console.log(clusterData);
  const relatedClusters = clusterData[0].relatedClusters;

  return (
    <div className="m- flex justify-center">
      <D3test clusterData={clusterData[0]} />
    </div>
  );
}
