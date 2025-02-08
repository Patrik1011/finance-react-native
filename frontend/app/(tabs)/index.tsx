import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
      <View style={styles.container}>
        <Text className='text-green-600 text-2xl'>Hello</Text>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});