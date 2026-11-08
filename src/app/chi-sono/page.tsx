import type { Metadata } from "next";
import { AboutBiography } from "@/components/about-biography";

export const metadata: Metadata = {
  title: "Chi sono",
  description:
    "Nadia Clementi, giornalista pubblicista di Trento. Interviste, medicina, diario e storie.",
};

export const revalidate = 300;

export default function AboutPage() {
  return <AboutBiography title="Chi sono" />;
}
