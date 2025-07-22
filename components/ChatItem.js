import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
import React, { useEffect, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Image } from "expo-image";
import { blurhash, formatDate, getRoomId } from "./common";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Colors } from "../constants/Colors";

const ChatItem = ({ item, noBorder, currentUser, router }) => {
  const [lastSeen, setLastSeen] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const theme = Colors[useColorScheme()] ?? Colors.light;

  const openChatRoom = () => {
    router.push({ pathname: "/chatRoom", 
      params: {
        ...item,
        profileUrl: encodeURIComponent(item.profileUrl)
      }});
    // router.push({ pathname: "/(shared)/chatRoom", params: item });
  };

  const [lastMessage, setLastMessage] = useState(undefined);

  useEffect(() => {
    let roomId = getRoomId(currentUser?.userId, item?.userId);
    const docRef = doc(db, "rooms", roomId);
    const messagesRef = collection(docRef, "messages");
    const q = query(messagesRef, orderBy("createdAt", "desc"));

    let unsub = onSnapshot(q, (snapshot) => {
      let allMessages = snapshot.docs.map((doc) => {
        return doc.data();
      });
      setLastMessage(allMessages[0] ? allMessages[0] : null);

      if (lastSeen) {
        const count = allMessages.filter(
          (msg) =>
            msg.userId !== currentUser.userId &&
            msg.createdAt?.toDate?.() > lastSeen.toDate?.()
        ).length;
        setUnreadCount(count);
      }
    });

    return unsub;
  }, [lastSeen]);

  const renderTime = () => {
    if (lastMessage) {
      let date = lastMessage?.createdAt;
      return formatDate(new Date(date?.seconds * 1000));
    }
  };

  const renderLastMessage = () => {
    if (typeof lastMessage == "undefined") return "Loading...";
    if (lastMessage) {
      if (currentUser?.userId === lastMessage?.userId)
        return "You: " + lastMessage?.text;
      return lastMessage?.text;
    } else {
      return "Say Hi ";
    }
  };

  useEffect(() => {
    const roomId = getRoomId(currentUser?.userId, item?.userId);
    const unsub = onSnapshot(doc(db, "rooms", roomId), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setLastSeen(data?.lastSeen?.[currentUser.userId]);
      }
    });

    return unsub;
  }, []);

  return (
    <TouchableOpacity
      onPress={openChatRoom}
      className={`flex-row justify-between mx-4 items-center gap-3 ${
        noBorder ? "" : "border-b mb-4 pb-4"
      } `}
      style={{maxHeight: hp(8),borderColor: theme.questionBorder}}
    >
      <Image
        style={{ height: hp(6), width: hp(6), borderRadius: 100 }}
        source={item?.profileUrl}
        placeholder={blurhash}
        transition={500}
      />

      <View className="flex-1 gap-1">
        <View className="flex-row justify-between">
          <Text
            style={{ fontSize: hp(1.8), color: theme.text }}
            className="font-semibold"
          >
            {item?.username}
          </Text>
          
          <Text
            style={{ fontSize: hp(1.8), color: theme.text2 }}
            className="font-medium"
          >
            {renderTime()}
          </Text>
        </View>
        <View className='flex-row justify-between'>
            <Text
            style={{ fontSize: hp(1.6), textAlign: 'justify', color: theme.text2 }}
            className="font-medium flex-1"
            >
            {renderLastMessage()}
            </Text>
            {unreadCount > 0 && (
            <View style={{backgroundColor: theme.deactivateButton}} className="px-2 py-1 rounded-full ml-2 items-center justify-center self-center">
              <Text style={{ fontSize: hp(1.3), color: theme.textContrast }} className="font-bold">
                {unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ChatItem;
