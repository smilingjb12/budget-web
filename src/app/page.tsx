"use client";

import { Routes } from "@/lib/routes";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  redirect(Routes.auctions());
}
