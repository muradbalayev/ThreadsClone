import { Box, Flex, Link, Text, VStack } from "@chakra-ui/layout"
import { Avatar } from "@chakra-ui/avatar"
import { BsInstagram } from "react-icons/bs"
import { CgMoreO } from "react-icons/cg"
import { Button, Menu, MenuButton, MenuItem, MenuList, Portal } from "@chakra-ui/react"
import { useToast } from '@chakra-ui/react'
import { useRecoilValue } from "recoil"
import userAtom from "../atoms/userAtom"
import { Link as RouterLink } from "react-router-dom"
import useFollowUnFollow from "../hooks/useFollowUnFollow"


function UserHeader({ user }) {
    const toast = useToast()

    const currentUser = useRecoilValue(userAtom) // This is the user logged in
   const { handleFollowUnfollow, updating, following  } = useFollowUnFollow(user)

 
    const copyURL = () => {
        const currentURL = window.location.href;
        navigator.clipboard.writeText(currentURL).then(() => {
            toast({
                description: 'Profile link copied',
                status: "success",
                duration: 1000,
                isClosable: true
            })
        });
    }
    return (
        <VStack gap={4} alignItems={"start"}>
            <Flex justifyContent={"space-between"} w={"full"}>
                <Box>
                    <Text fontSize={'2xl'} fontWeight={"bold"}>
                        {user.name}
                    </Text>
                    <Flex gap={2} alignItems={'center'}>
                        <Text fontSize={"sm"}>{user.username}</Text>
                        <Text fontSize={"xs"}
                            bg={"gray.dark"} color={"gray.light"} p={1} borderRadius={"full"}>
                            threads.net
                        </Text>

                    </Flex>
                </Box>
                <Box>
                    {user.profilePic ? (
                        <Avatar
                            name={user.name}
                            src={user.profilePic}
                            size={{
                                base: "lg",
                                md: "xl"
                            }}
                        />
                    ) : (
                        <Avatar
                            src=''
                            size={{
                                base: "lg",
                                md: "xl"
                            }}
                        />
                    )}

                </Box>
            </Flex>
            <Text>{user.bio}</Text>
            {currentUser?._id === user._id && (
                <RouterLink to="/update">
                    <Button size={'sm'}>
                        Edit Profile
                    </Button>
                </RouterLink>
            )}
            {currentUser?._id !== user._id && (
                <Button onClick={handleFollowUnfollow} isLoading={updating}
                    size={'sm'}>
                    {following ? 'Unfollow' : "Follow"}
                </Button>
            )}

            <Flex w={"full"} justifyContent={"space-between"}>
                <Flex gap={2} alignItems={"center"}>
                    <Text color={"gray.light"}>{user.followers.length} followers</Text>
                    <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
                    <Link color={"gray.light"}>instagram.com</Link>
                </Flex>
                <Flex>
                    <Box className="icon-container">
                        <BsInstagram size={24} cursor={"pointer"} />
                    </Box>
                    <Box className="icon-container">
                        <Menu>
                            <MenuButton>
                                <CgMoreO size={24} cursor={"pointer"} />
                            </MenuButton>
                            <Portal>
                                <MenuList bg={"gray.dark"}>
                                    <MenuItem bg={"gray.dark"} onClick={copyURL}>Copy Link</MenuItem>
                                </MenuList>
                            </Portal>
                        </Menu>
                    </Box>
                </Flex>
            </Flex>
            <Flex w={"full"}>
                <Flex flex={1}
                    borderBottom={"1.5px solid white"}
                    pb={3}
                    justifyContent={"center"}
                    cursor={"pointer"}>
                    <Text fontWeight={"bold"}>Threads</Text>
                </Flex>
                <Flex flex={1}
                    borderBottom={"1px solid gray"}
                    pb={3}
                    justifyContent={"center"}
                    cursor={"pointer"}
                    color={"gray.light"}>
                    <Text fontWeight={"bold"}>Replies</Text>
                </Flex>
            </Flex>
        </VStack>

    )
}

export default UserHeader