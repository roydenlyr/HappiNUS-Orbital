import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
//import { FlatList } from 'react-native-reanimated/lib/typescript/Animated'
//import { MentorProfileType } from '../constants/MentorProfiles'
//import LinearGradient from 'react-native-linear-gradient';
import { OpenSans_400Regular } from '@expo-google-fonts/open-sans';
import { Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('screen');


export default function ProfileCard({item, progress}) {
    // const animated = useAnimatedStyle(() => {
    //     const scale   = interpolate(progress.value, [-1, 0, 1], [0.8, 1, 0.8]);
    //     const opacity = interpolate(progress.value, [-1, 0, 1], [0.5, 1, 0.5]);
    //     return { transform: [{ scale }], opacity };
    // });

    let [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
    OpenSans_400Regular,
    })
    if (!fontsLoaded) return null

  return (
    <View style={styles.container}>
        <LinearGradient 
            colors={['#667eea', '#764ba2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}>
            <View style = {styles.avatarContainer} className = "flex-row justify-center">
                <Image source = {{ uri: item.avatar }} style={styles.avatar} className = "h-40 w-40"/>
            </View>
            {/* <View className = "px-5 mt-5 space-y-3">
                <Text style = {{ fontSize:16 }}>
                    <Text style = {{ fontWeight: 'bold', color: '#1E3A8A'}}>Name: </Text>
                    <Text style = {{ fontWeight: '500', color: '#1E3A8A'}}>{item.name}</Text>
                </Text>
                <Text style = {{ fontSize:16 }}>
                    <Text style = {{ fontWeight: 'bold', color: '#1E3A8A'}}>Gender: </Text>
                    <Text style = {{ fontWeight: '500', color: '#1E3A8A'}}>{item.gender}</Text>
                </Text>
                <Text style = {{ fontSize:16 }}>
                    <Text style = {{ fontWeight: 'bold', color: '#1E3A8A'}}>Year: </Text>
                    <Text style = {{ fontWeight: '500', color: '#1E3A8A'}}>{item.year}</Text>
                </Text>
                <Text style = {{ fontSize:16 }}>
                    <Text style = {{ fontWeight: 'bold', color: '#1E3A8A'}}>Faculty: </Text>
                    <Text style = {{ fontWeight: '500', color: '#1E3A8A'}}>{item.faculty}</Text>
                </Text>
            </View> */}
            <View style={styles.info}>
                <View style={styles.name_row}>
                    {/* <Ionicons name="person-outline" size={20} color="#fff" /> */}
                    <Text style={styles.name}>{item.name}</Text>
                </View>
                <View style={styles.row}>
                    <Ionicons name="calendar-outline" size={35} color="#fff" />
                    <Text style={styles.text}>{item.year}</Text>
                </View>
                <View style={styles.row}>
                    <Ionicons name="school-outline" size={35} color="#fff" />
                    <Text style={styles.text} numberOfLines={2}>{item.faculty}</Text>
                </View>
            </View>
        </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
    // circle: {
    //     width: 100,           
    //     height: 100,          
    //     borderRadius: 50,     
    //     backgroundColor: '#6DA9E4',
    // },
    avatarContainer: {
        // position: 'absolute',
        // top: -50,
        // zIndex: 2,
        //shadowColor: 'black',
        //shadowRadius: 30,
        //shadowOffset: {width: 0, height: 40},
        //shadowOpacity: 0.8
        marginTop: 35,
    },
    avatar: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 4,
        borderColor: '#fff',
    },
    card: {
        width: 290,
        height: 400,
        //justifyContent: "center",
        //alignItems: "center",

        // padding: 16,
        // marginRight: 12,
        backgroundColor: '#818CF8',
        borderRadius: 40,
        // elevation: 3, // Android
        // shadowColor: '#000', // iOS
        // shadowOpacity: 0.1,
        // shadowOffset: { width: 0, height: 2 },
        // shadowRadius: 4,
    },
    container:{
        justifyContent: "center",
        alignItems: "center",
        // width: width,
    },
    info: {
        flexGrow: 1,
        //justifyContent: 'center',
        //alignItems: 'center',
        width: '100%',
        marginTop: 20,
        //padding: 20,
    },
    name_row:{
        alignItems: 'center',
        marginBottom: 12,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'left',
        marginBottom: 12,
        paddingLeft: 35,
        paddingRight: 35,
        alignItems: 'center'
    },
    name:{
        //color: '#fff',
        fontSize: 30,
        //fontWeight: 'bold',
        fontFamily: 'Poppins_600SemiBold',
        color: '#333333' 
    },
    text: {
        marginLeft: 15,
        color: '#fff',
        fontSize: 17,
        flexShrink: 1,
        fontFamily: 'OpenSans_400Regular',
        //textAlign: 'justify'
    },
});
