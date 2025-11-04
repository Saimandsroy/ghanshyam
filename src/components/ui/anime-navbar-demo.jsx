import React from "react";
import { Home, FileText, CreditCard, Info, User, Briefcase } from "lucide-react";
import { AnimeNavBar } from "@/components/ui/anime-navbar";

const items = [
  {
    name: "Home",
    url: "#",
    icon: Home,
  },
  {
    name: "Features",
    url: "#features",
    icon: FileText,
  },
  {
    name: "About",
    url: "#about",
    icon: Info,
  },
  {
    name: "Contact",
    url: "#contact",
    icon: User,
  },
];

export function AnimeNavBarDemo() {
  return <AnimeNavBar items={items} defaultActive="Home" />;
}
