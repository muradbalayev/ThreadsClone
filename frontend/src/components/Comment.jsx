import { DeleteIcon } from "@chakra-ui/icons";
import { Avatar, Button, Divider, Flex, Text } from "@chakra-ui/react";

function Comment({reply, lastReply, isPostCreator, handleDeleteReply}) {
  return (
    <>
    <Flex gap={4} py={2} my={2} w={"full"}>
         <Avatar src={reply.userProfilePic} size={'sm'} />
         <Flex gap={1} w={'full'} flexDirection={'column'}>
            <Flex w={'full'} justifyContent={'space-between'} alignItems={'center'}>
                <Text fontSize={'small'} fontWeight={'bold'}>
                  {reply.username}
                  </Text>
                  {isPostCreator && (
              <Button size="sm" onClick={() => handleDeleteReply(reply._id)}>
                <DeleteIcon />
              </Button>
            )}
                
            </Flex>
            <Text>{reply.text}</Text>
            
         </Flex>
    </Flex>
    {!lastReply && <Divider my={4}/> }
    
    </>
  )
}

export default Comment