import { View, Text, useColorScheme } from 'react-native';
import { Menu } from 'react-native-paper';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Colors } from '../constants/Colors';


export const MenuItem = ({text, action, value, icon}) => {
    const theme = Colors[useColorScheme()] ?? Colors.light;
    return (
        <Menu.Item onPress={() => action(value)} title={
            <View className='flex-row justify-between items-center'>
                <View style={{paddingRight: wp(2)}} className='items-end'>
                    <Text>{icon}</Text>
                </View>
                <View className='items-start'>
                    <Text style={{fontSize: hp(1.7), color: theme.text}} className='font-semibold'>{text}</Text>                   
                </View>
            </View>
        }>
            
        </Menu.Item>
    )
}

export const Divider = () => {
    return (
        <View className='p-[1px] w-full bg-neutral-200'/>
    )
}