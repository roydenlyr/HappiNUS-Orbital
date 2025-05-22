import { Feather } from "@expo/vector-icons";
import { useTheme } from '@react-navigation/native';
import { useEffect } from "react";
import { Pressable, StyleSheet } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const TabBarButton = ({onPress, onLongPress, isFocused, routeName, color, label}) => {
    const { colors } = useTheme();
    
    const icon = {
        home: (props) => <Feather name = "home" size = {24} {...props}/>,
        chat: (props) => <Feather name = "message-circle" size = {24} {...props}/>,
        profile: (props) => <Feather name = "user" size = {24} {...props}/>,
    }

    // useEffect(() => {
    //     console.log("routeName:", routeName);
    //     console.log("icon keys:", Object.keys(icon));
    // }, [routeName]);

    const scale = useSharedValue(0);
    useEffect(() => {
        scale.value = withSpring( 
            typeof isFocused === 'boolean' ? (isFocused ? 1 : 0) : isFocused, 
            {duration: 350}
        ); 
    }, [scale, isFocused]);

    const animatedIconStyle = useAnimatedStyle(() => {
        const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2]);
        const top = interpolate(scale.value, [0, 1], [0, 9]);
        return{
            transform:[{
                scale: scaleValue
            }],
            top
        }
    });

    const animatedTextStyle = useAnimatedStyle(() => {
        const opacity = interpolate(scale.value, [0, 1], [1, 0]);
        return{
            opacity
        }
    });

  return (
    <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        style={ styles.tabBarItem }>
        <Animated.View style = {animatedIconStyle}>
            {icon[routeName]({ 
                color: isFocused ? "#FFF" : "#222" 
            })}
        </Animated.View>

        {/* {typeof icon[routeName] === 'function' ? (
            icon[routeName]({
                color: isFocused ? colors.primary : colors.text,
            })
            ) : (
            <Feather name="alert-circle" size={24} color="red" />
        )} */}
        <Animated.Text style={[{ color: isFocused ? "#FFF" : "#222", fontSize: 12 }, animatedTextStyle]}>
            {label}
        </Animated.Text>
    </Pressable>
  )
}

export default TabBarButton

const styles = StyleSheet.create({
    tabBarItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
    }
})