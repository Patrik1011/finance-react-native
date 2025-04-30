import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';

export const CameraComponent = () => {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] =
    MediaLibrary.usePermissions();
  const [photo, setPhoto] = useState<{ uri: string } | null>(null);

  const cameraRef = useRef<CameraView | null>(null);

  async function requestAllPermissions() {
    await requestPermission();
    await requestMediaPermission();
  }

  useEffect(() => {
    requestAllPermissions();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const picture = await cameraRef.current.takePictureAsync();
      if (picture) {
        setPhoto(picture);
      }
    }
  };

  const savePicture = async () => {
    if (photo?.uri) {
      await MediaLibrary.saveToLibraryAsync(photo.uri);
      setPhoto(null);
    }
  };

  const discardPicture = () => {
    setPhoto(null);
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  if (!permission || !mediaPermission) {
    return <View />;
  }

  // if (!permission.granted || !mediaPermission.granted) {
  //   return (
  //     <View style={styles.container}>
  //       <Text style={styles.message}>We need permission to access camera and media library</Text>
  //       <Button onPress={requestAllPermissions} title="Grant Permissions" />
  //     </View>
  //   );
  // }

  return (
    <View style={styles.container}>
      {photo ? (
        <>
          <Image source={{ uri: photo.uri }} style={styles.preview} />
          <View style={styles.actions}>
            <Button title="Save" onPress={savePicture} />
            <Button title="Discard" onPress={discardPicture} />
          </View>
        </>
      ) : (
        <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={toggleCameraFacing}
            >
              <Text style={styles.text}>Flip</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={takePicture}>
              <Text style={styles.text}>Snap</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  message: {
    textAlign: 'center',
    padding: 16,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginBottom: 40,
    backgroundColor: 'transparent',
  },
  button: {
    padding: 16,
    backgroundColor: '#00000080',
    borderRadius: 10,
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
  preview: {
    flex: 1,
    resizeMode: 'cover',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 20,
  },
});
