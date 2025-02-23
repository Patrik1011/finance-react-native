import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ListScreen from './list/index';
import AddCategoryScreen from './add';
import { RootStackParamList } from '@/utils/types/navigation';
import { StackConfig } from '@/utils/types/types';

const Stack = createStackNavigator<RootStackParamList>();

const ListStackConfig: StackConfig<keyof RootStackParamList>[] = [
  {
    name: 'List',
    component: ListScreen,
    options: { title: 'Category List' },
  },
  {
    name: 'AddCategory',
    component: AddCategoryScreen,
    options: { title: 'Add New Category' },
  },
];

function ListStack() {
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

export default ListStack;
