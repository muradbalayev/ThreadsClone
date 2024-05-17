import { Avatar, Divider, Flex, Image, Skeleton, SkeletonCircle, Text, useColorModeValue } from '@chakra-ui/react'
import Message from './Message'
import MessageInput from './MessageInput'
import { useEffect, useRef, useState } from 'react'
import useShowToast from '../hooks/useShowToast'
import conversationsAtom, { selectedConversationAtom } from '../atoms/conversationsAtom'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import userAtom from '../atoms/userAtom'
import { useSocket } from '../context/SocketContext'

const MessageContainer = () => {
    const showToast = useShowToast()
    const selectedConversation = useRecoilValue(selectedConversationAtom)
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [messages, setMessages] = useState([]);
    const currentUser = useRecoilValue(userAtom)
    const { socket } = useSocket();
    const setConversations = useSetRecoilState(conversationsAtom)

    const messageRef = useRef(null)

    useEffect(() => {
        socket.on("newMessage", (message) => {

            if (selectedConversation._id === message.conversationId) {
                setMessages((prevMessage) => [...prevMessage, message]);
            }

            setConversations((prev) => {
                const updatedConversations = prev.map((conversation) => {
                    if (conversation._id === message.conversationId) {
                        return {
                            ...conversation,
                            lastMessage: {
                                text: message.text,
                                sender: message.sender
                            }
                        }
                    }
                    return conversation;
                })
                return updatedConversations
            })
        })
        return () => socket.off("newMessage")
    }, [socket, selectedConversation, setConversations])


    useEffect(() => {
        messageRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    useEffect(() => {
        const getMessages = async () => {
            setLoadingMessages(true);
            setMessages([])
            try {

                if (selectedConversation.mock) return

                const res = await fetch(`/api/messages/${selectedConversation.userId}`)
                const data = await res.json();
                if (data.error) {
                    showToast("Error", data.error, "error")
                    return;
                }
                setMessages(data)
            } catch (error) {
                showToast('Error', error.message, "error")
            } finally {
                setLoadingMessages(false)
            }
        }
        getMessages();
    }, [showToast, selectedConversation.userId, selectedConversation.mock])

    return (
        <Flex flex={'70%'}
            borderRadius={'md'}
            flexDirection={'column'}
            p={1}
            bg={useColorModeValue('gray.200', "gray.dark")}>
            {/*Message Header(Profile pic and username)  */}

            <Flex px={2} w={'full'} h={12} alignItems={'center'} gap={2}>
                <Avatar src={selectedConversation.userProfilePic} size={'sm'} />
                <Text display={'flex'} alignItems={'center'}>
                    {selectedConversation.username} <Image src='/verified.png' w={'4'} h={'4'} ml={1} />
                </Text>
            </Flex>
            <Divider />

            {/* Messages */}
            <Flex flexDirection={'column'} gap={4} my={4} px={2}
                h={'370px'} overflowY={'auto'}>
                {loadingMessages &&
                    [...Array(5)].map((_, i) => (
                        <Flex key={i} gap={2} alignItems={'center'} p={1}
                            borderRadius={'md'}
                            alignSelf={i % 2 === 0 ? 'flex-start' : 'flex-end'}>
                            {i % 2 === 0 && <SkeletonCircle size={7} />}
                            <Flex flexDirection={'column'} gap={'2'}>
                                <Skeleton h={'8px'} w={'250px'} />
                                <Skeleton h={'8px'} w={'250px'} />
                                <Skeleton h={'8px'} w={'250px'} />
                            </Flex>
                            {i % 2 !== 0 && <SkeletonCircle size={7} />}

                        </Flex>
                    ))}

                {!loadingMessages && (
                    messages.map((message) => (
                        <Flex key={message._id}
                            direction={'column'}
                            ref={messages.length - 1 === messages.indexOf(message) ? messageRef : null}
                        >
                            <Message message={message} ownMessage={currentUser._id === message.sender} />
                        </Flex>
                    ))
                )

                }
            </Flex>
            <MessageInput setMessages={setMessages} />
        </Flex>
    )
}

export default MessageContainer