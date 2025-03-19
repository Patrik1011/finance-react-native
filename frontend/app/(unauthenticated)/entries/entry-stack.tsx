import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import EntryListScreen from './list/index';
import { RootStackParamList } from '@/utils/types/navigation';
import { StackConfig } from '@/utils/types/types';
import EntryCreateScreen from './create';

const Stack = createStackNavigator<RootStackParamList>();

const ListStackConfig: StackConfig<keyof RootStackParamList>[] = [
  {
    name: 'List',
    component: EntryListScreen,
    options: { title: 'Entry List' },
  },
  {
    name: 'CreateEntry',
    component: EntryCreateScreen,
    options: { title: 'Add New Entry' },
  },
  {
    name: 'UpdateEntry',
    component: EntryCreateScreen,
    options: { title: 'Edit Entry' },
  },
];

function EntryListStack() {
  return (
    <Stack.Navigator>
      {ListStackConfig.map((config) => (
        <Stack.Screen
          key={config.name}
          name={config.name}
          component={config.component}
          options={config.options}
        />
      ))}
    </Stack.Navigator>
  );
}

export default EntryListStack;
