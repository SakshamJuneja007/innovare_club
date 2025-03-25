import { LucideIcon } from "lucide-react";

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
}

export interface Section {
  id: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  stats: Array<{ label: string; value: string }>;
  icon: LucideIcon;
  team?: TeamMember[];
}
