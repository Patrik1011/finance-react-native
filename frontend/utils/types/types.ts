import { StackNavigationOptions } from '@react-navigation/stack';

export type StackConfig<T> = {
  name: T;
  component: React.ComponentType;
  options: StackNavigationOptions;
};
