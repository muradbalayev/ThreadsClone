import { Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import { useState } from 'react';
import { IoSendSharp } from "react-icons/io5"
import useShowToast from '../hooks/useShowToast';
import conversationsAtom, { selectedConversationAtom } from '../atoms/conversationsAtom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
function MessageInput({ setMessages }) {
  const [messageText, setMessageText] = useState('');
  const selectedConversation = useRecoilValue(selectedConversationAtom)
  const setConversations = useSetRecoilState(conversationsAtom);
  const showToast = useShowToast();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText) return;

    try {
      const res = await fetch(`/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          recipientId: selectedConversation.userId
        })
      })
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error")
        return;
      }
      console.log(data)
      setMessages((messages) => [...messages, data])

      //Update the lastMessage in Conversations Component
      setConversations(prevConv => {
        const updatedConversations = prevConv.map(conversation => {
          if (conversation._id === selectedConversation._id) {
            return {
              ...conversation,
              lastMessage: {
                text: messageText,
                sender: data.sender
              }
            }
          }
          return conversation;
        })
        return updatedConversations
      });
      
      setMessageText('')
    } catch (error) {
      showToast('Error', error.message, "error")
    }
  }
  return (
    <form onSubmit={handleSendMessage}>
      <InputGroup>
        <Input value={messageText} onChange={(e) => setMessageText(e.target.value)}
          w={'full'} placeholder='Type a message' />
        <InputRightElement onClick={handleSendMessage} cursor={'pointer'}>
          <IoSendSharp cursor={'pointer'} />
        </InputRightElement>
      </InputGroup>
    </form>
  )
}

export default MessageInput