import { Tabs } from "expo-router";

import CustomTabBar from "../../components/navigation/CustomTabBar";

export default function TabsLayout() {
    return (
        <Tabs
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                }}
            />

            <Tabs.Screen
                name="analytics"
                options={{
                    title: "Analytics",
                }}
            />

            <Tabs.Screen
                name="split"
                options={{
                    title: "Split",
                }}
            />

            <Tabs.Screen
                name="more"
                options={{
                    title: "More",
                }}
            />
        </Tabs>
    );
}