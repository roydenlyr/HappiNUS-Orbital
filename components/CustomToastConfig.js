import { BaseToast, ErrorToast } from 'react-native-toast-message';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const CustomToastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#e63127',
        borderRadius: 12, 
        paddingVertical: 8,
        paddingHorizontal: 10,
        marginHorizontal: 10,
      }}
      text1Style={{ fontSize: hp(2), fontWeight: 'bold' }}
      text2Style={{ fontSize: hp(1.5) }}
    />
  ),
  info: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#3498db',
        borderRadius: 12, 
        paddingVertical: 8,
        paddingHorizontal: 10,
        marginHorizontal: 10,
      }}
      text1Style={{ fontSize: hp(2), fontWeight: 'bold' }}
      text2Style={{ fontSize: hp(1.5) }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{
        borderRadius: 12, 
        paddingVertical: 8,
        paddingHorizontal: 10,
        marginHorizontal: 10,
      }}
      text1Style={{ fontSize: hp(2) }}
      text2Style={{ fontSize: hp(1.5) }}
    />
  )
};

export default CustomToastConfig;
