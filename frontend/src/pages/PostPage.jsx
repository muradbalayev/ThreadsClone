import { Avatar, Button, Divider, Image, Box, Flex, Text } from "@chakra-ui/react"
import { BsThreeDots } from "react-icons/bs"
import Actions from "../components/Actions"
import { useState } from "react"
import Comment from "../components/Comment";

function PostPage() {
  const [liked, setLiked] = useState(false);
  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar name="Mark Zuckerberg" src="/zuck-avatar.png" size={"md"} />
          <Flex alignItems={"center"}>
            <Text fontSize={'small'} fontWeight={"bold"}>markzuckerberg</Text>
            <Image w={4} h={4} ml={2} src="/verified.png" />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text fontSize={"sm"} color={"gray.light"}>1d</Text>
          <BsThreeDots size={24} cursor={"pointer"} />
        </Flex>
      </Flex>

      <Text my={3}>Let&apos;s talk about threads </Text>
      <Box borderRadius={6}
        overflow={"hidden"}
        border={"1px solid"}
        borderColor={"gray.light"}>
        <Image src={'/post1.png'} w={"full"} />
      </Box>
      <Flex gap={3} my={3}>
        <Actions liked={liked} setLiked={setLiked} />
      </Flex>
      <Flex gap={2} alignItems={'center'}>
        <Text color={'gray.light'} fontSize={'sm'}>238 replies</Text>
        <Box w={1} h={1} borderRadius={'full'} bg={'gray.light'}></Box>
        <Text color={'gray.light'} fontSize={'sm'}>
          {200 + (liked ? 1 : 0)} likes
        </Text>
      </Flex>
      <Divider my={4} />
      <Flex justifyContent={'space-between'}>
        <Flex gap={2} alignItems={'center'}>
          <Text fontSize={'2xl'}>✌</Text>
          <Text color={'gray.light'}>Get the app to like, reply and post.</Text>
        </Flex>
        <Button>
          Get
        </Button>
      </Flex>
      <Divider my={4} />
      <Comment
        comment='Looks really good'
        createdAt="2d"
        likes={100}
        username='johndoe'
        userAvatar='https://bit.ly/dan-abramov'
      />

      <Comment
        comment='Looks really good'
        createdAt="1d"
        likes={100}
        username='johndoe'
        userAvatar='https://bit.ly/code-beast' 
        />

      <Comment
        comment='Looks really good'
        createdAt="2d"
        likes={100}
        username='johndoe'
        userAvatar='https://bit.ly/dan-abramov' 
        />
    </>
  )
}

export default PostPage