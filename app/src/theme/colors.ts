export const colors = {
    background: {
        primary: "#1E3A8A",     // Deep Navy Blue (Tab bar background)
        secondary: "#172554",   // Darker Navy (For cards/containers)
        pressed: "#1E40AF",     // Slightly lighter navy (Tab pressed state)
        transparent: "transparent",
    },

    text: {
        primary: "#FFFFFF",     // Pure White (Main text)
        secondary: "#60A5FA",   // Light Blue (Subtitles/Secondary text)
        inverse: "#1E3A8A",     // Deep Navy (For text on top of white buttons)
    },

    icon: {
        active: "#FFFFFF",      // Pure White (Active tab icon)
        inactive: "#60A5FA",    // Light Blue (Inactive tab icons & Scan button)
    },

    accent: {
        primary: "#3B82F6",     // Vibrant Royal Blue (For active buttons/highlights anywhere in app)
    },

    border: {
        default: "#172554",     // Darker Navy (Tab bar top border)
    },

    shadow: {
        default: "#000000",
    },
} as const;