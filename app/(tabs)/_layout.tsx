import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Platform } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        // @ts-ignore
        headerShown: false,
        tabBarActiveTintColor: '#2563eb',
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 90 : 65,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          paddingTop: 10
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          // @ts-ignore
          title: 'Home',
          // @ts-ignore
          tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          // @ts-ignore
          title: 'Feed',
          // @ts-ignore
          tabBarIcon: ({ color, size }) => <Feather name="message-square" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          // @ts-ignore
          title: 'Report',
          // @ts-ignore
          tabBarIcon: ({ color, size }) => <Feather name="camera" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          // @ts-ignore
          title: 'Profile',
          // @ts-ignore
          tabBarIcon: ({ color, size }) => <Feather name="user" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}