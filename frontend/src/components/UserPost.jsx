import { Box, Flex, Text } from "@chakra-ui/layout";
import { Avatar } from "@chakra-ui/avatar";
import { Link } from "react-router-dom";
import { Image, Menu, MenuButton, MenuItem, MenuList, Portal, useToast } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "./Actions";
import { useState } from "react";

function UserPost({postImg, postTitle, likes, replies}) {
    const [liked, setLiked] = useState(false)

    const toast = useToast()

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
        <div>
            <Flex gap={3} mb={4} py={5}>
                <Flex flexDirection={"column"} alignItems={"center"}>
                    <Avatar size={"md"}
                     name="Mark Zuckerberg" 
                     src="/zuck-avatar.png" />
                    <Box w={"1px"} h={"full"} bg={"gray.light"} my={2}></Box>
                    <Box position={"relative"} w={"full"}>
                        <Avatar
                            size={"xs"}
                            name="John Doe"
                            src="https://bit.ly/dan-abramov"
                            position={"absolute"}
                            top={"0px"}
                            left={"12px"}
                            padding={"2px"} />
                        <Avatar
                            size={"xs"}
                            name="Christian Nwamba"
                            src="https://bit.ly/code-beast"
                            position={"absolute"}
                            bottom={"0px"}
                            right={"-2px"}
                            padding={"2px"} />
                        <Avatar
                            size={"xs"}
                            name="Segun Adebayo"
                            src="https://bit.ly/dan-abramov"
                            position={"absolute"}
                            bottom={"0px"}
                            left={"0px"}
                            padding={"2px"} />
                    </Box>
                </Flex>
                <Flex flex={1}
                    flexDirection={"column"}
                    gap={2}>
                    <Flex justifyContent={"space-between"} w={"full"}>
                        <Flex w={"full"} alignItems={"center"}>
                            <Text fontSize={"small"} fontWeight={"bold"}>markzuckerberg</Text>
                            <Image src="/verified.png" w={4} h={4} ml={1} />
                        </Flex>
                        <Flex gap={4} alignItems={"center"}>
                            <Text fontSize={"small"} color={"gray.light"}>1d</Text>
                            <Menu>
                            <MenuButton>
                            <BsThreeDots />
                            </MenuButton>
                            <Portal>
                                <MenuList bg={"gray.dark"}>
                                    <MenuItem bg={"gray.dark"} onClick={copyURL}>Copy Link</MenuItem>
                                </MenuList>
                            </Portal>
                        </Menu>
                        </Flex>
                    </Flex>
                    <Text fontSize={"small"}>{postTitle}</Text>
                    {postImg && (
                    <Box borderRadius={6}
                        overflow={"hidden"}
                        border={"1px solid"}
                        borderColor={"gray.light"}>
                            <Link to={'/markzuckerberg/post/1'}>
                        <Image src={postImg} w={"full"} />
                            </Link>
                    </Box>
                    )
                    }
                    <Flex gap={3} my={1}>
                        <Actions liked={liked} setLiked={setLiked}/>
                    </Flex>

                    <Flex gap={2} alignItems={"center"}>
                        <Text color={"gray.light"} fontSize={'small'}>{replies} replies</Text>
                        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
                        <Text color={"gray.light"} fontSize={"small"}>{liked ? (likes + 1) : likes} likes</Text>
                    </Flex>

                </Flex>
            </Flex>
        </div >
    );
}

export default UserPost;
