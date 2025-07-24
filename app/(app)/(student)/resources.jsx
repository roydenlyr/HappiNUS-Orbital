import { View, Text, useColorScheme, FlatList, TouchableOpacity, Linking, Platform } from 'react-native'
import React, { useRef, useState } from 'react'
import { Colors } from '../../../constants/Colors'
import { Poppins_200ExtraLight_Italic, Poppins_300Light, Poppins_500Medium, Poppins_600SemiBold, useFonts } from '@expo-google-fonts/poppins'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { RESOURCES } from '../../../constants/Resources';
import { useRouter } from 'expo-router';

const Resources = () => {

  const theme = Colors[useColorScheme()] ?? Colors.light;
  const router = useRouter();

  let globalIndex = 0
  const [buttonSize, setButtonSize] = useState({});
  
  const [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_300Light,
    Poppins_200ExtraLight_Italic
  })

  const handleSelect = (link, title) => {
    if (title.includes('GAD-7') || title.includes('PHQ-9')) {
      router.push(link);
      return;
    }
    Linking.openURL(link);
  }

  return (
    <View style={{backgroundColor: theme.appBackground, flex: 1}}>
      <FlatList 
        data={RESOURCES}
        keyExtractor={item => item.category}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: hp(5)}}
        renderItem={({item}) => (
          <View className='px-5'>
            <Text style={{fontFamily: (fontsLoaded ? 'Poppins_600SemiBold' : undefined), fontSize: hp(2), color: theme.header}} className='self-center mt-3'>{item.category}</Text>
            {
              item.contents.map((content, index) => {
                const currentIndex = globalIndex;
                globalIndex++;
                return (
                <TouchableOpacity onPress={() => handleSelect(content.link, content.title)} key={currentIndex} style={{backgroundColor: theme.cardBackground}} className='rounded-3xl my-1 p-3'
                  onLayout={(event) => 
                    {
                      const {height} = event.nativeEvent.layout;
                      const size = {
                        bottom: height
                      }
                      setButtonSize((prev) => ({...prev, [currentIndex]: size}));
                    }
                  }
                  hitSlop={Platform.OS === 'android' ? buttonSize[currentIndex] : undefined}
                >
                  <Text style={{fontFamily: (fontsLoaded ? 'Poppins_500Medium' : undefined), color: theme.bodyText, fontSize: hp(1.5)}}>{content.title}</Text>
                  <Text style={{fontFamily: (fontsLoaded ? 'Poppins_300Light' : undefined), color: theme.bodyText, fontSize: hp(1.3)}}>{content.description}</Text>
                </TouchableOpacity>
                )
              })
            }
          </View>
        )}
      />
    </View>
  )
}

export default Resources