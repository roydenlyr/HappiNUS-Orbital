import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Image, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Colors } from '../constants/Colors';

const MentorCard = ({mentor, fromRoom, keepChat}) => {
  // Calculating by academic year
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const academicYear = currentMonth >= 7 ? currentYear : currentYear - 1;
  const year = academicYear - parseInt(mentor.matricYear) + 1;

  const age = currentYear - parseInt(mentor.dob);

  const genderIcon = mentor.gender === 'Male' ? 'male-outline' : (mentor.gender === 'Female' ? 'female-outline' : 'transgender-outline');

  const router = useRouter();

  const theme = Colors[useColorScheme()] ?? Colors.light;

  const handleChatNow = () => {
    router.replace({pathname: '/chatRoom', params: {
      ...mentor,
      profileUrl: encodeURIComponent(mentor.profileUrl),
      fromRoom,
      keepChat,
    }});     
  }

  
  return (
<LinearGradient
  colors={[theme.gradientStart, theme.gradientEnd]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
  style={{ borderRadius: 40, height: hp(55), width: wp(70), maxWidth: 600, alignSelf: 'center', paddingTop: hp(8)}}
>
      <View style={{shadowColor: 'black', shadowRadius: 40, shadowOffset: {width: 0, height: 30}, shadowOpacity: 0.7}} className='flex-row justify-center -mt-14'>
        <Image source={{uri: mentor.profileUrl}}  className='h-40 w-40 rounded-full' />
      </View>
      <View className='flex-1 justify-center px-5'>
        <View style={{marginTop: hp(2), alignItems: 'center'}}>
          <Text style={{fontSize: hp(4), color: theme.textContrast}} className='font-bold'>{mentor.username}</Text>
        </View>
        <View style={{marginTop: hp(2), paddingLeft: hp(2)}} className='flex-row gap-4'>
          <Ionicons name={genderIcon} color={theme.textContrast} size={hp(3)}/>
          <Text style={{fontSize: hp(2), color: theme.textContrast}}>{mentor.gender}</Text>
        </View>
        <View style={{marginTop: hp(2), paddingLeft: hp(2)}} className='flex-row gap-4'>
          <FontAwesome name='birthday-cake' color={theme.textContrast} size={hp(3)}/>
          <Text style={{fontSize: hp(2), color: theme.textContrast}}>{age}</Text>
        </View>
        <View style={{marginTop: hp(2), paddingLeft: hp(2)}} className='flex-row gap-4'>
          <FontAwesome name='calendar' color={theme.textContrast} size={hp(3)}/>
          <Text style={{fontSize: hp(2), color: theme.textContrast}}>Year {year}</Text>
        </View>
        <View style={{marginTop: hp(2), paddingLeft: hp(2), flexDirection: 'row', alignItems: 'center'}} className='flex-row gap-4'>
          <Ionicons name='school-sharp' color={theme.textContrast} size={hp(3)}/>
          <Text style={{fontSize: hp(2), color: theme.textContrast}} className='text-white pr-10' numberOfLines={2}>{mentor.faculty}</Text>
        </View>
      </View>
      <View style={{marginTop: hp(2), paddingRight: hp(2), paddingBottom: hp(1)}} className='flex-row gap-4 justify-end m-3'>
        <TouchableOpacity onPress={handleChatNow} style={{height: hp(4), backgroundColor: theme.chatButton}} className='bg-white rounded-full items-center flex-row gap-3 px-4'>
          <Text style={{fontSize: hp(2), color: theme.text}} className='font-semibold'>
            Need to talk?
          </Text>
          <Ionicons name='chatbubble-outline' size={hp(3)} color={theme.text}/>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  )
}

export default MentorCard