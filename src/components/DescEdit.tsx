"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import React from "react";

export default function DescEdit({
  authId,
  id,
}: {
  authId: string;
  id: number;
}) {
  const [description, setDescription] = React.useState("");
  const descData = {
    description: description,
    authId: authId,
    id: id,
  };
  const router = useRouter();
  const handleSubmit = async () => {
    await fetch("http://localhost:3000/api/editClusterDesc", {
      method: "POST",
      body: JSON.stringify(descData),
    });
    router.refresh();
  };

  return (
    <div className="flex flex-col w-full gap-2">
      <h4 className="text-center scroll-m-20 text-base font-semibold tracking-tight">
        Edit Cluster Description
      </h4>
      <Textarea
        placeholder="Max. 191 letters."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Button onClick={handleSubmit} className="lg:self-end">
        Update
      </Button>
    </div>
  );
}
