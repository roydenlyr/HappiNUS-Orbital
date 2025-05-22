import { useLinkBuilder, useTheme } from '@react-navigation/native';
import { useState } from "react";
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import TabBarButton from './TabBarButton';

export function TabBar({ state, descriptors, navigation }) {
  const { colors } = useTheme();
  const { buildHref } = useLinkBuilder();

    // const icon = {
    //     home: (props) => <Feather name = "home" size = {24} {...props}/>,
    //     chat: (props) => <Feather name = "compass" size = {24} {...props}/>,
    //     profile: (props) => <Feather name = "user" size = {24} {...props}/>,
    // }
    const [dimensions, setDimensions] = useState({height: 20, width: 100});

    const buttonWidth = dimensions.width / state.routes.length; 

    // const onTabbarLayout = (e: import('react-native').LayoutChangeEvent) => {
    //     setDimensions({
    //         height: nativeEvent.layout.height,
    //         width: nativeEvent.width,
    //     });
    // };

    const onTabBarLayout = e => {
        const { width, height } = e.nativeEvent.layout
        setDimensions({ width, height })
    }

    const tabPositionX = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => {
        return{
            transform: [{translateX: tabPositionX.value}]
        }
    });

  return (
    <View onLayout={onTabBarLayout} style={ styles.tabBar }>
    <Animated.View style = {[animatedStyle,{
            position: 'absolute',
            backgroundColor: '#818CF8',
            borderRadius: 38,
            marginHorizontal: 12,
            height: dimensions.height - 15,
            width: buttonWidth - 25, 
    }]} />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
            tabPositionX.value = withSpring(buttonWidth * index, {duration: 1500});
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
            <TabBarButton
                key = {route.name}
                onPress={onPress}
                onLongPress={onLongPress}
                isFocused={isFocused}
                routeName={route.name}
                color={isFocused ? "#FFF" : "#222"}
                label={label}
            />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 80,
    paddingVertical: 15,
    borderRadius: 55,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
  },
//   tabBarItem: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: 5,
//   }
})

