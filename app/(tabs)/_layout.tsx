import {Tabs} from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import{ COLORS } from "../../constants/theme";

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarStyle: { height: 60 },
				tabBarActiveTintColor: "#9FE3FF",
				tabBarInactiveTintColor: "gray",
				tabBarShowLabel: false,
			}}
		>
			<Tabs.Screen
				name="home"
				options={{
					title: "Home",
					tabBarIcon: ({ color, size, focused }) => (
						<Ionicons
							name={focused ? "home" : "home-outline"}
							size={size}
							color={color}
						/>
					),
				}}
			/>
            <Tabs.Screen
                name="scores"
				options={{
					title: "Scores",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? "trophy" : "trophy-outline"}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
			<Tabs.Screen
                name="settings"
				options={{
					title: "Settings",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? "settings" : "settings-outline"}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

			<Tabs.Screen name="quiz" options={{ href: null }} />
			<Tabs.Screen name="results" options={{ href: null }} />

		</Tabs>
	);
}
