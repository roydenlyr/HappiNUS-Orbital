import { Ionicons } from '@expo/vector-icons';
import { ImageBackground } from 'expo-image';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import MentalHealthCard from '../../../components/MentalHealthCard';
import { mentalHealthResources } from '../../../constants/MentalHealthResources';
import { db } from '../../../firebaseConfig';

const { width: screenWidth , height: screenHeight } = Dimensions.get('screen')
const UNSPLASH_ACCESS_KEY = "cB5tdDyPuDi3OLRB9uZsnh3yfwxyre3PQ4tGl9pPppA";
// https://api.unsplash.com/photos/random?query=nature&orientation=landscape&client_id=cB5tdDyPuDi3OLRB9uZsnh3yfwxyre3PQ4tGl9pPppA

const Page = () => {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(true);
  const [photo, setPhoto] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0)
  const [text, setText] = useState('')

  const handleSend = async () => {
    const trimmed = text.trim()
    if (!trimmed) return

    try {
      // Write only the text + timestamp into "feedbacks" collection
      await addDoc(collection(db, 'feedbacks'), {
        text: trimmed,
        createdAt: serverTimestamp()
      })
      setText('')
    } catch (err) {
      console.error('Error sending feedback:', err)
    }
  }

  useEffect(() => {
    fetch('https://zenquotes.io/api/quotes', {
      headers: {
        'X-Api-Key': 'bkZIMgRf/qXZ61Odl8GyeQ==jvSFhIy4qEGQjd14',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setQuote(data[0].q);
        setAuthor(data[0].a);
        setLoading(false);
      })
      .catch((error) => {
        console.error('API Error:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          "https://api.unsplash.com/photos/random?query=nature&orientation=landscape",
          {
            headers: {
              Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
              "Accept-Version": "v1",
            },
          }
        );
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.errors?.join(", ") || res.statusText);
        }
        const data = await res.json();
        setPhoto({
          url: data.urls.regular,
          //description: data.alt_description,
          //author: data.user.name,
        });
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);


  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6DA9E4" />
      </View>
    );
  }

  return (
    //console.log(photo.url),
    <View style = {styles.container}>
      <View style={styles.container}>
        <ImageBackground source = {{uri: photo.url}} style = {styles.background} imageStyle={{ borderRadius: 25 }}>
          <View style={styles.overlay}/>
          <View style = {styles.textcontainer}>
            <Text style={styles.quoteText}>{quote}</Text>
            <Text style={styles.quoteAuthor}>~ {author}</Text>
          </View>
        </ImageBackground>
      </View>
      <View style = {styles.container}>
        <Carousel
          width={screenWidth*0.8}
          height={200}
          data={mentalHealthResources}
          renderItem={({ item, index }) => (<MentalHealthCard item={item} index={index}/>)}
          loop={true}                
          autoPlay={true}            
          autoPlayInterval={5000}    
          autoPlayReverse={false}    
          snapEnabled
          onSnapToItem={index => setCurrentIndex(index)}
        />
        <View style={styles.dotsContainer}> 
          {mentalHealthResources.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentIndex
                  ? styles.dotActive
                  : styles.dotInactive
              ]}
            />
          ))}
        </View>        
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80}
      >
        <View style={styles.feedbackcontainer}>
          <TextInput
            style={styles.input}
            placeholder="Write feedback for your mentor…"
            placeholderTextColor="#999"
            multiline
            value={text}
            onChangeText={setText}

          />
          <TouchableOpacity
            style={[styles.sendButton, !text.trim() && styles.sendDisabled]}
            onPress={handleSend}
            disabled={!text.trim()}
          >
            <Ionicons
              name="send"
              size={20}
              color="#fff"             
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      
    </View>
    

  )
}

export default Page

const styles = StyleSheet.create({
    container:{
      //flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    background: {
      width: '80%',
      alignSelf: 'center',
      aspectRatio: 16 / 9,   
      marginVertical: 20,
      contentFit: 'cover',
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.3)',
      borderRadius: 25,
    },
    textcontainer: {
      flex: 1,
      width: 300,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 20,
    },
    quoteText: {
      fontSize: 18,
      color: '#FFF',
      fontStyle: 'italic',
      textAlign: 'center',
      marginBottom: 10,
    },
    quoteAuthor: {
      color: '#FFF',
      fontWeight: 'bold',
      textAlign: 'right', 
      alignSelf: 'flex-end'
    },
    dotsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 12,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 4,
      //backgroundColor: '#aaa',
    },
    dotActive: {
      backgroundColor: '#667eea',
    },
    dotInactive: {
      backgroundColor: '#ccc',
    },
    feedbackcontainer: {
      marginTop: 30,
      flexDirection: 'row',
      alignItems: 'center',

      paddingHorizontal: 12,
      paddingVertical: 8,
      //backgroundColor: '#fff',
      //borderTopWidth: 1,
      //borderColor: '#eee',
      //width: 400,
      width: 330,
    },
    input: {
      flex: 1,
      maxHeight: 120,
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: '#E0F7FA',
      borderRadius: 20,
      fontSize: 16,
      //color: '#333',

    },
    sendButton: {
      marginLeft: 8,
      backgroundColor: '#818CF8',
      borderRadius: 20,
      padding: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sendDisabled: {
      //backgroundColor: '#C5C9F1',
      opacity: 1,
    },
})