import { ImageBackground } from 'expo-image';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MentalHealthCard({item}) {
  return (
    //console.log(item.image),
      <View style={styles.container}>
        <ImageBackground source = {{uri: item.image}} style = {styles.background} imageStyle={{ borderRadius: 25 }}>
          <View style={styles.overlay}/>
          <View style = {styles.content}>
            <Text style={styles.name}>{item.name}</Text>
            <TouchableOpacity 
              style={styles.button} 
              onPress={() => Linking.openURL(item.link)}
            >
              <Text style={styles.buttonText}>Find Out More</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
  )
}

const styles = StyleSheet.create({
    container:{
      //flex: 1,
      //justifyContent: 'center',
      //alignItems: 'center',
      //justifyContent: 'space-between', // pushes items to top and bottom
    },
    content:{
      //alignItems: 'flex-end',
      alignItems:'center',
    },
    background: {
      width: '100%',
      alignSelf: 'center',
      aspectRatio: 16 / 9,   
      marginVertical: 20,
      contentFit: 'cover',
      justifyContent: 'space-evenly',

    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.3)',
      borderRadius: 25,
    },
    name: {
      color: '#FFF',
      fontWeight: 'bold',
      textAlign: 'center', 
      fontSize: 25,
      marginTop: 10,
      //alignSelf: 'flex-end'
    },
    button: {
      backgroundColor: '#818CF8',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      //alignSelf: 'flex-end',
      marginTop: 10,
      //marginLeft: 30,
    },
    buttonText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 14,
    },
})
