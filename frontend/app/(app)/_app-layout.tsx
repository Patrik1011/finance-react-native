import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import EntryListStack from './entries/entry-stack';
import ListStack from './categories/category-stack';
import ProfileScreen from './profile';

const Tab = createBottomTabNavigator();

type TabConfig = {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  component: React.ComponentType;
};

const tabConfig: TabConfig[] = [
  {
    name: 'Entries',
    icon: 'menu',
    component: EntryListStack,
  },
  {
    name: 'Category',
    icon: 'search',
    component: ListStack,
  },
  {
    name: 'Profile',
    icon: 'person',
    component: ProfileScreen,
  },
];

export default function AppLayout() {
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
