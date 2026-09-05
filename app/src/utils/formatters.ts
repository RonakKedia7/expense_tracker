export function formatINR(amountInPaise: number): string {
    const rupees = amountInPaise / 100;

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: rupees % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2,
    }).format(rupees);
}

export function formatRelativeDate(timestamp: number): string {
    const date = new Date(timestamp);
    const now = new Date();

    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    const isToday = date.toDateString() === now.toDateString();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    const isYesterday = date.toDateString() === yesterday.toDateString();

    const timeStr = date.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
    });

    // Very recent
    if (diffMinutes < 1) {
        return "Just now";
    }

    if (diffMinutes < 60) {
        return `${diffMinutes}m ago`;
    }

    if (isToday && diffHours < 6) {
        return `${diffHours}h ago`;
    }

    if (isToday) {
        return `Today, ${timeStr}`;
    }

    if (isYesterday) {
        return `Yesterday, ${timeStr}`;
    }

    // Same year
    if (date.getFullYear() === now.getFullYear()) {
        return date.toLocaleDateString("en-IN", {
            weekday: "short",
            month: "short",
            day: "numeric",
        });
    }

    // Previous years
    return date.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}