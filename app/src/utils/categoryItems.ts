import {
    Utensils,
    ShoppingCart,
    Bus,
    ShoppingBag,
    Zap,
    Film,
    HeartPulse,
    TrendingUp,
    Tag,
    Users,
    LucideIcon,
} from "lucide-react-native";

export interface CategoryItem {
    id: string;
    label: string;
    icon: LucideIcon;
}

export const CATEGORIES: CategoryItem[] = [
    { id: "Split", label: "Split", icon: Users },
    { id: "Food & Dining", label: "Food", icon: Utensils },
    { id: "Groceries", label: "Groceries", icon: ShoppingCart },
    { id: "Transport", label: "Transport", icon: Bus },
    { id: "Shopping", label: "Shopping", icon: ShoppingBag },
    { id: "Bills & Utilities", label: "Bills", icon: Zap },
    { id: "Entertainment", label: "Entertainment", icon: Film },
    { id: "Health", label: "Health", icon: HeartPulse },
    { id: "Investment", label: "Investment", icon: TrendingUp },
    { id: "Other", label: "Other", icon: Tag },
];

