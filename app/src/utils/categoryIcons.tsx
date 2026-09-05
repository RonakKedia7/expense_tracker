import { Utensils, ShoppingCart, Bus, ShoppingBag, Receipt, Film, Tag, Zap, Coffee, HeartPulse, Users } from 'lucide-react-native';

export function getCategoryIcon(category: string, color: string, size = 20) {
    const cat = category.toLowerCase();
    if (cat.includes('split') || cat.includes('split bill')) {
        return <Users size={size} color={color} />;
    }
    if (cat.includes('food') || cat.includes('restaurant') || cat.includes('dining')) {
        return <Utensils size={size} color={color} />;
    }
    if (cat.includes('grocery') || cat.includes('groceries')) {
        return <ShoppingCart size={size} color={color} />;
    }
    if (cat.includes('transport') || cat.includes('travel') || cat.includes('cab') || cat.includes('fuel')) {
        return <Bus size={size} color={color} />;
    }
    if (cat.includes('shopping') || cat.includes('clothes')) {
        return <ShoppingBag size={size} color={color} />;
    }
    if (cat.includes('bill') || cat.includes('utility') || cat.includes('utilities')) {
        return <Zap size={size} color={color} />;
    }
    if (cat.includes('coffee') || cat.includes('cafe')) {
        return <Coffee size={size} color={color} />;
    }
    if (cat.includes('health') || cat.includes('medical')) {
        return <HeartPulse size={size} color={color} />;
    }
    if (cat.includes('entertainment') || cat.includes('movie')) {
        return <Film size={size} color={color} />;
    }
    return <Tag size={size} color={color} />;
}