import { Tabs } from 'expo-router';
import HomeHeader from '../../../components/HomeHeader';
import { TabBar } from '../../../components/TabBar';
const AppLayout = () => {
  // const router = useRouter();

  // useEffect(() => {
  //   router.push('/chatRoom'); 
  // }, []);

  return (
    // <Stack>
    //   <Stack.Screen name='home' options={{
    //     header: () => <HomeHeader />
    //   }} />
    // </Stack>
    <Tabs tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name = "home" options = {{ title: "Home" , header: ({options}) => <HomeHeader title = {options.title}/>}} />
      <Tabs.Screen name = "chat" options = {{ title: "Chat" , header: ({options}) => <HomeHeader title = {options.title}/> }}/>
      <Tabs.Screen name = "profile" options = {{ title: "Profile" , header: ({options}) => <HomeHeader title = {options.title}/> }}/>
    </Tabs>
  )
}
 
export default AppLayout

