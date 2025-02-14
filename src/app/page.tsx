"use client";

import { Routes } from "@/lib/routes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return <section className="bg-white dark:bg-gray-900">Home</section>;
}
