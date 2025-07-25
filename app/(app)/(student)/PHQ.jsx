import { View, Text, useColorScheme, ScrollView, TouchableOpacity, Pressable, findNodeHandle, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Colors } from '../../../constants/Colors'
import { Poppins_500Medium, Poppins_600SemiBold, useFonts } from '@expo-google-fonts/poppins'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Feather } from '@expo/vector-icons'
import { Link, useRouter } from 'expo-router'
import { OPTIONS, PHQ_QUESTIONS } from '../../../constants/Test';
import { GAD7Explanation } from '../../../services/GAD7Explanation';
import { Loading, LoadingSmile } from '../../../components/Animation';
import Modal from 'react-native-modal';
import { PHQ9Explanation } from '../../../services/PHQ9Explanation';

const PHQ = () => {
  const theme = Colors[useColorScheme()] ?? Colors.light;
    const [fontsLoaded] = useFonts({
      Poppins_500Medium,
      Poppins_600SemiBold
    })
  
    const router = useRouter();
    const [selectedOptions, setSelectedOptions] = useState(Array(7).fill(null));
    const [startAssessment, setStartAssessment] = useState(false);
    const [resultLoading, setResultLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
  
    const scrollRef = useRef();
    const question1Y = useRef(0);
    const [hasScrolled, setHasScrolled] = useState(false);
  
    const handleOptionPress = (questionIndex, optionIndex) => {
      const updatedSelections = [...selectedOptions];
      if (updatedSelections[questionIndex] === optionIndex) {
        updatedSelections[questionIndex] = null
      } else {
        updatedSelections[questionIndex] = optionIndex;
      }
      setSelectedOptions(updatedSelections);
    };
  
    const handleStartAssessment = () => {
      if (!startAssessment) {
        setHasScrolled(false);
      }
      setStartAssessment(value => !value);
    }
  
    const clearOptions = () => {
      setSelectedOptions(Array(7).fill(null));
    }
  
    useEffect(() => {
      if (startAssessment){
        scrollRef.current.scrollTo({ y: question1Y.current, animated: true });
      } else {
        clearOptions();
      }
    }, [startAssessment])
  
    const handleSubmit = async () => {
      const isComplete = selectedOptions.every(option => option != null);
      if (!isComplete) {
        Alert.alert('Incomplete', 'Please answer all questions before submitting.');
        return;
      }
  
      setModalVisible(true);
      setResultLoading(true)
      const totalScore = selectedOptions.reduce((sum, val) => sum + val, 0);
      let severity;
      if (totalScore <= 4) severity = 'Minimal or None';
      else if (totalScore <= 9) severity = 'Mild Depression';
      else if (totalScore <= 14) severity = 'Moderate Depression';
      else if (totalScore <= 19) severity = 'Moderately Severe';
      else severity = 'Severe Anxiety';
      
      try {
        const result = await PHQ9Explanation(totalScore, severity);  
        // Display result to user
        handleStartAssessment();
        clearOptions();
        setResult(result);
      } catch (err) {
        console.error('PHQ9Explanation failed:', err.message);
        Alert.alert('Error', 'Something went wrong while generating your result. Please try again later.');
      } finally {
        setResultLoading(false);
      }
    }
  
    return (
      <ScrollView ref={scrollRef} style={{backgroundColor: theme.appBackground}} className='p-5 flex-1'>
        <Text style={{fontFamily: (fontsLoaded ? 'Poppins_600SemiBold' : undefined), fontSize: hp(2), color: theme.header}} className='self-center'>What is PHQ-9?</Text>
        <Text style={{color: theme.text, textAlign: 'center'}} className='self-center'>
          The Patient Health Questionaire-9 (PHQ-9) is a set of 9 questions commonly used to help understand if someone might be experiencing symptoms of depression.
          It’s designed for individuals aged 12 and above, and helps you reflect on how you’ve been feeling over the past two weeks.
        </Text>
  
        <View className='gap-2 mt-5'>
          <View className='flex-row justify-center items-center gap-3'>
            <Feather name='info' size={hp(2)} color={theme.header}/>
            <Text style={{fontFamily: (fontsLoaded ? 'Poppins_600SemiBold' : undefined), fontSize: hp(2), color: theme.header}} className='self-center'>Disclaimer</Text>
          </View>
          <Text style={{ color: theme.text, textAlign: 'center' }} className="self-center">
            Please note that this is a self-assessment and not a medical diagnosis.{" "}
            Results are analysed by OpenAI API referencing{' '}
            <Link 
              href="https://www.healthhub.sg/programmes/mindsg/caring-for-ourselves/understanding-depression-adults?utm_source=google&utm_medium=paid-search&utm_campaign=fy25mhao&utm_content=rerunpost6_depression_adults&gad_source=1#home" 
              style={{ color: theme.ctaButton, textDecorationLine: 'underline' }} 
              target="_blank"
            >
              HealthHub (Ministry of Health) guidelines
            </Link>
            .
          </Text>
          <Text style={{color: theme.text, textAlign: 'center'}} className='self-center'>
            If you are under 18 years old and concerned about your results, please seek advice from a trusted adult.
          </Text>
          <Text style={{ color: theme.text, textAlign: 'center' }} className="self-center">
            For professional help, see our{' '}
            <Text 
              style={{ color: theme.ctaButton, textDecorationLine: 'underline' }} 
              onPress={() => router.push('/resources')}>
              Resources
            </Text>
            {' '}page.
          </Text>
        </View>
        
        <View style={{backgroundColor: theme.modalCardBackground}} className='rounded-3xl justify-center items-center mt-5 p-3 gap-3'>
          <Text style={{fontFamily: (fontsLoaded ? 'Poppins_600SemiBold' : undefined), fontSize: hp(2), color: theme.header}}>Instructions</Text>
          <Text style={{color: theme.text, textAlign: 'center'}}>
            For each question, please SELECT the option that comes closest to how you have felt {''}
            <Text className='font-semibold'>IN THE PAST 2 WEEKS</Text>
            {''} — not just how you feel today.
          </Text>
          <Text style={{color: theme.text, textAlign: 'center'}}>Complete all 9 questions.</Text>
          <Text style={{color: theme.text, textAlign: 'center'}}>
            Your score will be automatically calculated and shown to you after you submit your response.
          </Text>
          <TouchableOpacity onPress={handleStartAssessment} className='rounded-full p-3' style={{backgroundColor: theme.ctaButton}}>
            <Text style={{color: theme.textContrast}}>{startAssessment ? 'Cancel' : 'Start'} Self-Assessment</Text>
          </TouchableOpacity>
        </View>
        {
          startAssessment && (
          PHQ_QUESTIONS.map((question, qIndex) => (
            <View onLayout={qIndex === 0 ? (event) => {
                question1Y.current=event.nativeEvent.layout.y;
                if (startAssessment && !hasScrolled) {
                  scrollRef.current.scrollTo({ y: question1Y.current, animated: true });
                  setHasScrolled(true);
                }
              } : undefined} 
              key={qIndex} className="mt-3 items-center justify-center border rounded-3xl p-2 w-full" style={{borderColor: theme.questionBorder}}>
              <Text style={{fontFamily: (fontsLoaded ? 'Poppins_600SemiBold' : undefined), fontSize: hp(1.5), color: theme.header}} className="mb-2 text-center">
                Question {qIndex + 1}: {question}
              </Text>
              <View className="gap-2 w-full">
                {
                  OPTIONS.map((option, oIndex) => (
                    <TouchableOpacity onPress={() => handleOptionPress(qIndex, oIndex)} key={oIndex} style={{backgroundColor: (selectedOptions[qIndex] === oIndex ? theme.selectionActive : theme.selectionInactive)}} className="rounded-full p-2 w-full items-center">
                      <Text style={{color: (selectedOptions[qIndex] === oIndex ? theme.selectionActiveText : theme.selectionInactiveText)}}>{option}</Text>
                    </TouchableOpacity>
                  ))
                }
              </View>
            </View>
          ))
        )}
        {
          startAssessment && (
            <TouchableOpacity onPress={handleSubmit} style={{backgroundColor: theme.button}} className='rounded-3xl mt-3 mb-20 p-3 justify-center items-center'>
              <Text style={{fontFamily: (fontsLoaded ? 'Poppins_500Medium' : undefined), fontSize: hp(1.8), color: theme.textContrast}}>Submit</Text>
            </TouchableOpacity>
          ) 
        }
        {
          modalVisible && (
            <Modal 
              isVisible={modalVisible}
              onBackdropPress={() => {setModalVisible(false); setResult(null)}}
              onBackButtonPress={() => {setModalVisible(false); setResult(null)}}
              hideModalContentWhileAnimating={true}
              animationIn={'zoomIn'}
              animationOut={'fadeOut'}
              backdropOpacity={0.5}
              propagateSwipe={true}
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
            >
              <View style={{width: wp(80), height: hp(60), maxWidth: 600, borderRadius: 20, backgroundColor: theme.modalCardBackground}} className='items-center p-3'>
                <ScrollView contentContainerStyle={{alignItems: 'center'}} showsVerticalScrollIndicator={false}>
                  <Text style={{fontFamily: (fontsLoaded ? 'Poppins_600SemiBold' : undefined), fontSize: hp(2), color: theme.header}}>Your PHQ-9 Result</Text>
                  {
                    resultLoading ? (
                        <LoadingSmile size={hp(20)} />
                    ) : (
                      <>
                        <Text style={{color: theme.text}}>Total Score: {result?.score}</Text>
                        <Text style={{color: theme.text}}>Severity: {result?.severity}</Text>
                        <Text style={{color: theme.text, textAlign: 'justify'}} className='mt-3'>{result?.explanation}</Text>
                        <Text style={{color: theme.text, textAlign: 'justify'}} className='mt-3'>
                          Note: We won’t save this result. If it’s helpful, you can take a screenshot to keep it for your own reference.
                        </Text>
                      </>
                    )
                  }
                  
                </ScrollView>
              </View>
            </Modal>
          )
        }
      </ScrollView>
    )
  }

export default PHQ