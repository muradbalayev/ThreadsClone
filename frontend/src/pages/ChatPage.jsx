import { SearchIcon } from "@chakra-ui/icons"
import { Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text, useColorModeValue } from "@chakra-ui/react"
import Conversation from "../components/Conversation";
import { GiConversation } from 'react-icons/gi'
import MessageContainer from "../components/MessageContainer";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast"
import { useRecoilState, useRecoilValue } from "recoil";
import conversationsAtom, { selectedConversationAtom } from "../atoms/conversationsAtom";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";

const ChatPage = () => {
    const [searchingUser, setSearchingUser] = useState(false);
    const [loadingConversations, setLoadingConversations] = useState(true)
    const [searchText, setSearchText] = useState('')
    const currentUser = useRecoilValue(userAtom);
    const [conversations, setConversations] = useRecoilState(conversationsAtom)
    const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom)
    const showToast = useShowToast()
    const { socket, onlineUsers } = useSocket()


    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await fetch("/api/messages/conversations")
                const data = await res.json()
                if (data.error) {
                    showToast("Error", data.error, "error")
                    return;
                }
                // console.log(data)
                setConversations(data);
            } catch (error) {
                showToast('Error', error.message, "error")
            } finally {
                setLoadingConversations(false)
            }
        }
        getConversations();
    }, [showToast, setConversations]);

    const handleConversationSearch = async (e) => {
        e.preventDefault();
        setSearchingUser(true)
        try {
            const res = await fetch(`/api/users/profile/${searchText}`)
            const searchedUser = await res.json();
            if (searchedUser.error) {
                showToast("Error", searchedUser.error, "error")
                return;
            }
            //If user is trying to message himself give error
            const messagingYourself = searchedUser._id === currentUser._id
            if (messagingYourself) {
                showToast("Error", "You cannot message yourself", "error")
                return;
            }

            // If user is already in a conversation with a searched user
            const conversationAlreadyExists = conversations.find(conversation => conversation.participants[0]._id === searchedUser._id)
            if (conversationAlreadyExists) {
                setSelectedConversation({
                    _id: conversationAlreadyExists._id,
                    userId: searchedUser._id,
                    username: searchedUser.username,
                    userProfilePic: searchedUser.profilePic
                })
                return
            }

            // When we search for a user which we 
            // still not messaged yet, create that users box in conversation page
            const mockConversation = {
                mock: true,
                lastMessage: {
                    text: '',
                    sender: ''
                },
                _id: Date.now(),
                participants: [
                    {
                        _id: searchedUser._id,
                        username: searchedUser.username,
                        profilePic: searchedUser.profilePic
                    }
                ]
            }
            setConversations((prevConv) => [...prevConv, mockConversation]);

        } catch (error) {
            showToast('Error', error.message, "error")

        } finally {
            setSearchingUser(false)
        }
    }

    return (
        <Box position={'absolute'}
            left={'50%'}
            w={{ lg: '750px', md: '80%', base: '100%' }}
            transform={'translateX(-50%)'}
            padding={4}
            pt={0}
        >
            <Flex gap={4} mx={'auto'} flexDirection={{
                base: 'column',
                sm: 'row'
            }}
                maxW={{
                    sm: '500px',
                    md: 'full'
                }}>
                <Flex flex={30} gap={2} flexDirection={'column'} maxW={{
                    sm: '250px',
                    md: 'full'
                }}
                    mx={'auto'}>
                    <Text fontWeight={700} color={useColorModeValue("gray.600", "gray.400")}>
                        Your Conversations
                    </Text>
                    <form onSubmit={handleConversationSearch}>
                        <Flex alignItems={'center'} gap={2}>
                            <Input value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Search for a user." />
                            <Button size={'sm'} onClick={handleConversationSearch} isLoading={searchingUser}>
                                <SearchIcon />
                            </Button>
                        </Flex>
                    </form>
                    {loadingConversations && (
                        [0, 1, 2, 3, 4].map((_, i) => (
                            <Flex key={i} gap={4} alignItems={'center'} p={'1'} borderRadius={'md'}>
                                <Box>
                                    <SkeletonCircle size={'10'} />
                                </Box>

                                <Flex w={'full'} flexDirection={'column'} gap={3}>
                                    <Skeleton h={'10px'} w={'80px'} />
                                    <Skeleton h={'8px'} w={'90%'} />
                                </Flex>
                            </Flex>
                        ))
                    )}
                    {!loadingConversations && (
                        conversations.map(conversation => (
                            <Conversation key={conversation._id}
                                isOnline={onlineUsers.includes(conversation.participants[0]._id)}
                                conversation={conversation} />
                        ))
                    )}
                </Flex>
                {!selectedConversation._id &&
                    (
                        <Flex flex={70}
                            borderRadius={'md'}
                            p={2}
                            flexDirection={'column'}
                            alignItems={'center'}
                            justifyContent={'center'}
                            h={'400px'}>
                            <GiConversation size={100} />
                            <Text textAlign={'center'} fontSize={20}>Select a conversation to start messaging!</Text>
                        </Flex>
                    )}
                {selectedConversation._id && (
                    <MessageContainer />
                )}


            </Flex>
        </Box>
    )
}

export default ChatPage
