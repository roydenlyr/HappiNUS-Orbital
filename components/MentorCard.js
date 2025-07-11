import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

const MentorCard = ({mentor}) => {
  // Calculating by academic year
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const academicYear = currentMonth >= 7 ? currentYear : currentYear - 1;
  const year = academicYear - parseInt(mentor.matricYear) + 1;

  const age = currentYear - parseInt(mentor.dob);

  const genderIcon = mentor.gender === 'Male' ? 'male-outline' : (mentor.gender === 'Female' ? 'female-outline' : 'transgender-outline');

  const router = useRouter();

  const handleChatNow = () => {
    router.replace({pathname: '/chatRoom', params: {
      ...mentor,
      profileUrl: encodeURIComponent(mentor.profileUrl)
    }});     
  }

  
  return (
<LinearGradient
  colors={['#667eea', '#764ba2']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
  style={{ borderRadius: 40, height: '100%', width: wp(70), maxWidth: 600, alignSelf: 'center', paddingTop: hp(8)}}
>
      <View style={{shadowColor: 'black', shadowRadius: 40, shadowOffset: {width: 0, height: 30}, shadowOpacity: 0.7}} className='flex-row justify-center -mt-14'>
        <Image source={{uri: mentor.profileUrl}}  className='h-40 w-40 rounded-full' />
      </View>
      <View className='flex-1 justify-center px-5'>
        <View style={{marginTop: hp(2), alignItems: 'center'}}>
          <Text style={{fontSize: hp(4)}} className='font-bold text-white'>{mentor.username}</Text>
        </View>
        <View style={{marginTop: hp(2), paddingLeft: hp(2)}} className='flex-row gap-4'>
          <Ionicons name={genderIcon} color={'white'} size={hp(3)}/>
          <Text style={{fontSize: hp(2)}} className='text-white'>{mentor.gender}</Text>
        </View>
        <View style={{marginTop: hp(2), paddingLeft: hp(2)}} className='flex-row gap-4'>
          <FontAwesome name='birthday-cake' color={'white'} size={hp(3)}/>
          <Text style={{fontSize: hp(2)}} className='text-white'>{age}</Text>
        </View>
        <View style={{marginTop: hp(2), paddingLeft: hp(2)}} className='flex-row gap-4'>
          <FontAwesome name='calendar' color={'white'} size={hp(3)}/>
          <Text style={{fontSize: hp(2)}} className='text-white'>Year {year}</Text>
        </View>
        <View style={{marginTop: hp(2), paddingLeft: hp(2), flexDirection: 'row', alignItems: 'center'}} className='flex-row gap-4'>
          <Ionicons name='school-sharp' color={'white'} size={hp(3)}/>
          <Text style={{fontSize: hp(2)}} className='text-white pr-10' numberOfLines={2}>{mentor.faculty}</Text>
        </View>
      </View>
      <View style={{marginTop: hp(2), paddingRight: hp(2), paddingBottom: hp(1)}} className='flex-row gap-4 justify-end m-3'>
        <TouchableOpacity onPress={handleChatNow} style={{height: hp(4)}} className='bg-white rounded-full items-center flex-row gap-3 px-4'>
          <Text style={{fontSize: hp(2)}} className='font-semibold text-indigo-500'>
            Need to talk?
          </Text>
          <Ionicons name='chatbubble-outline' size={hp(3)} color={'#6366F1'}/>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  )
}

export default MentorCard