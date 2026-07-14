import {
  FolderCode,
  Heart,
  LayoutDashboard,
  Settings,
  Tags,
} from "lucide-react";

export const appNavigation = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/snippets", label: "All snippets", icon: FolderCode },
  { href: "/favorites", label: "Favorites", icon: Heart },
  { href: "/tags", label: "Tags", icon: Tags },
  { href: "/settings/profile", label: "Settings", icon: Settings },
] as const;
