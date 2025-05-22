import { Dimensions, StyleSheet, View } from 'react-native';
import { useSharedValue } from "react-native-reanimated";
import ProfileCard from '../../../components/ProfileCard';
//import Carousel from 'react-native-snap-carousel';
import Carousel from 'react-native-reanimated-carousel';
import { mentorProfiles } from '../../../constants/MentorProfiles';

const { width: screenWidth } = Dimensions.get('screen');
const ITEM_WIDTH = 260;

const Profile = () => {
  const progress = useSharedValue(0);
  return (
    <View style = {styles.container}>
          <Carousel
            // containerCustomStyle = {{overflow: 'visible'}}
            // data={mentorProfiles}
            // renderItem={({item}) => <ProfileCard item={item}/>}
            // firstItem={1}
            // inactiveSlideOpacity={0.75}
            // inactiveSlideScale={0.77}
            // //sliderWidth={400}
            // //itemWidth={260}
            // width={400}
            // slideStyle = {{display: 'flex', alignItems: 'center'}}
            //autoPlayInterval={2000}
            data={mentorProfiles}
            // customAnimation={(value) => {
            //   'worklet';
            //   // scale like parallax does (you can tweak these)
            //   const scale = interpolate(value, [0, 0.5, 1], [1, 0.85, 1]);
            //   // fade side cards to 70% opacity at midpoint
            //   const opacity = interpolate(value, [0, 0.5, 1], [1, 0.7, 1]);
            //   return { transform: [{ scale }], opacity };
            // }}
            renderItem={({ item, index }) => (<ProfileCard item={item} index={index}/>)}
            height={400}
            //loop={true}

            width={screenWidth}
            // style={{
            //   width: width,
            // }}
            contentContainerStyle={{ paddingHorizontal: (screenWidth - ITEM_WIDTH) / 2 }}
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 0.9,
              parallaxScrollingOffset: 110,
            }}
            onProgressChange={(offset) => {
              // offset goes from -1 to 1
              progress.value = offset;
            }}
            pagingEnabled={true}
            snapEnabled={true}
            //onProgressChange={progress}
            // contentContainerStyle={{
            //   paddingHorizontal: (screenWidth - ITEM_WIDTH) / 2,
            // }}
            //panGestureHandlerProps={{ activeOffsetX: [-10, 10] }}
            slideStyle={{ overflow: 'visible' }}
          />
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
  card: {
    flex: 1,
    //marginTop: 64,
    //paddingVertical: 8,
    // alignItems: "center",
    // justifyContent: "center"
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // heading: {
  //   fontWeight: "bold",
  //   fontSize: 18,
  //   textAlign: "center",
  // },
})