import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AdminImagesScreen from './images';
import ProfileScreen from '../(app)/profile';

const Tab = createBottomTabNavigator();

type TabConfig = {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  component: React.ComponentType;
};

const tabConfig: TabConfig[] = [
  {
    name: 'Images',
    icon: 'menu',
    component: AdminImagesScreen,
  },
  {
    name: 'Profile',
    icon: 'person',
    component: ProfileScreen,
  },
];

export default function AdminLayout() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      {tabConfig.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={tab.icon} color={color} size={size} />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}
