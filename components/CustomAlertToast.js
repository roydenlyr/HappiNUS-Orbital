import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const colors = {
  success: '#15803D',   // Dark green (darker than #22C55E)
  info: '#1D4ED8',      // Dark blue (darker than #3B82F6)
  error: '#B91C1C',     // Dark red (darker than #EF4444)
  warning: '#B45309'    // Dark amber (darker than #F59E0B)
};

const icons = {
  success: 'checkmark-circle',
  info: 'information-circle-sharp',
  error: 'notifications-circle-sharp',
  warning: 'warning'
};

const bgColorMap = {
  success: 'rgba(34, 197, 94, 0.2)',
  info: 'rgba(59, 130, 246, 0.2)',
  error: 'rgba(239, 68, 68, 0.2)',
  warning: 'rgba(245, 158, 11, 0.2)'
};

const textBg = {
    success: '#DCFCE7',  // Light mint green
    info: '#DBEAFE',     // Light sky blue
    error: '#FEE2E2',    // Light rose red
    warning: '#FEF3C7'   // Light amber yellow
}

const CustomAlertToast = ({ type, text1, text2, onAction, actionLabel, onPress }) => {
  const color = colors[type] || '#3B82F6';
  const icon = icons[type] || 'information-circle';

  return (
    <TouchableOpacity onPress={onPress}>
    <View style={{
      flexDirection: 'column',
      backgroundColor: `${bgColorMap[type]}`,
      borderLeftWidth: 4,
      borderLeftColor: color,
      borderRadius: 12,
      padding: 12,
      marginHorizontal: 10,
    }}>
      <View className='flex-row justify-center gap-5' style={{minWidth: wp(70)}}>
        <View className='items-start justify-center'>
            <Ionicons name={icon} size={hp(3)} color={color} />
        </View>
        
        <View className='flex-1'>
            <Text className='self-center font-extrabold' style={{fontSize: hp(2), color}}>{text1}</Text>
            <Text className='font-semibold rounded-3xl px-2 text-center' style={{fontSize: hp(1.5), color, backgroundColor: textBg[type]}}>{text2}</Text>
        </View>
      </View>
    </View>
    </TouchableOpacity>
  );
};

export default CustomAlertToast;
