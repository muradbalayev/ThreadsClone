import { Avatar, Flex, Text } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { selectedConversationAtom } from "../atoms/conversationsAtom";
import userAtom from "../atoms/userAtom";

const Message = ({ message, ownMessage }) => {
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const user = useRecoilValue(userAtom)
  return (
    <>
      {ownMessage ? (
        <Flex gap={2} alignSelf={"flex-end"}>
          <Text maxW={{
            sm: '250px',
            md: '350px'
          }} 
          fontSize={{
            md: 'md',
            base: 'sm'
          }}
          bg={"blue.600"} p={1} borderRadius={"md"}>
           {message.text}
          </Text>
          <Avatar w={7} h={7} src={user.profilePic} />
        </Flex>
      ) : (
        <Flex gap={2}>
          <Avatar w={7} h={7} src={selectedConversation.userProfilePic} />
          <Text maxW={{
            sm: '250px',
            md: '350px'
          }}
          fontSize={{
            md: 'md',
            base: 'sm'
          }}
            bg={"gray.600"} p={1} borderRadius={"md"}>
       {message.text}

          </Text>
        </Flex>
      )}
    </>
  );
};

export default Message;
