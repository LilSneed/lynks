"use client";

import Link from "next/link";
import React from "react";
import Image from "next/image";
import { Button } from "./ui/button";
export default function Lynk({
  img,
  url,
  id,
  edit,
  title,
  color,
}: {
  id: number;
  img: string;
  url: string;
  edit: boolean;
  title: string;
  color: string;
}) {
  console.log(url, "url");
  return (
    <div className="mt-5">
      {edit && (
        <div className="text-center items-center flex justify-end">
          <Link href={`/edit/${url}`}>
            <Button variant="ghost" className="bg-secondary mr-10">
              Edit
            </Button>
          </Link>
        </div>
      )}
      <a href={`https://${url}`} key={id} target="_blank">
        <div
          style={{ backgroundColor: color }}
          className="flex flex-row rounded-full "
        >
          <div className="p-1 flex">
            <p className="grow text-md self-center">{img}</p>
          </div>
          <h2 className="text-black text-center grow self-center scroll-m-20 text-md font-medium tracking-tight pr-4">
            {title}
          </h2>
        </div>
      </a>
    </div>
  );
}
