import { View } from "react-native";

import { colors } from "../../theme";

export function AppTransition() {
    return (
        <View
            className="absolute inset-0 z-50"
            style={{
                backgroundColor: colors.background.primary,
            }}
        />
    );
}
