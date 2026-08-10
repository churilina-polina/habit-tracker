import { BookOpen, Droplet, Sparkles, Zap } from "lucide-react";

export const CATEGORY_META = {
  health: { icon: Droplet, label: "Здоровье", tagClass: "tag-health" },
  study: { icon: BookOpen, label: "Учёба", tagClass: "tag-study" },
  productivity: { icon: Zap, label: "Продуктивность", tagClass: "tag-productivity" },
  other: { icon: Sparkles, label: "Другое", tagClass: "tag-other" },
};

export const CATEGORY_ORDER = ["health", "study", "productivity", "other"];
