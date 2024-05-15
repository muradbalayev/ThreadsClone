import { Box, Flex, Text } from "@chakra-ui/layout";
import { Avatar } from "@chakra-ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { Image } from "@chakra-ui/react";
// import { BsThreeDots } from "react-icons/bs";
import Actions from "./Actions";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";

import { formatDistanceToNow } from 'date-fns'
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";

function Post({ post, postedBy }) {
    const [user, setUser] = useState(null)
    const [posts, setPosts] = useRecoilState(postsAtom);
    const showToast = useShowToast();
    const navigate = useNavigate();
    const currentUser = useRecoilValue(userAtom)
    console.log(postedBy)
    
    //fetch user

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/users/profile/` + postedBy)
                const data = await res.json()
                if (data.error) {
                    showToast('Error', data.error, 'error')
                    return;
                }
                setUser(data)

            } catch (error) {
                showToast('Error', error, 'error')
                setUser(null)
            }
        }
        getUser()
    }, [postedBy, showToast])


    const handleDeletePost = async (e) => {
        try {
            e.preventDefault()
            if (!window.confirm("Are you sure you want to delete this post?")) return;

            const res = await fetch(`/api/posts/${post._id}`, {
                method: "DELETE"
            })
            const data = await res.json();
            if (data.error) {
                showToast('Error', data.error, 'error')
                return
            }
            showToast('Success', "Post deleted!", 'success')
            setPosts(posts.filter((p) => p._id !== post._id))
        } catch (error) {
            showToast('Error', error, 'error')
        }
    }

    if (!user) return null

    return (
        <div>
            <Link to={`/${user.username}/post/${post._id}`}>

                <Flex gap={3} mb={4} py={5}>
                    <Flex flexDirection={"column"} alignItems={"center"}>
                        <Avatar size={"md"}
                            onClick={(e) => {
                                e.preventDefault();
                                navigate(`/${user.username}`)

                            }}
                            name={user?.name}
                            src={user?.profilePic} />
                        <Box w={"1px"} h={"full"} bg={"gray.light"} my={2}></Box>
                        <Box position={"relative"} w={"full"}>
                            {post.replies.length === 0 && <Text textAlign={"center"}>🥱</Text>}
                            {post.replies[0] && (
                                <Avatar
                                    size={"xs"}
                                    name={post.replies[0].username}
                                    src={post.replies[0]}
                                    position={"absolute".userProfilePic}
                                    top={"px"}
                                    left={"12px"}
                                    padding={"2px"} />

                            )}
                            {post.replies[1] && (
                                <Avatar
                                    size={"xs"}
                                    name={post.replies[1].username}
                                    src={post.replies[1].userProfilePic}
                                    position={"absolute"}
                                    bottom={"10px"}
                                    right={"-2px"}
                                    padding={"2px"} />

                            )}
                            {post.replies[2] && (
                                <Avatar
                                    size={"xs"}
                                    name={post.replies[2].username}
                                    src={post.replies[2].userProfilePic}
                                    position={"absolute"}
                                    bottom={"10px"}
                                    left={"0px"}
                                    padding={"2px"} />

                            )}

                        </Box>
                    </Flex>
                    <Flex flex={1}
                        flexDirection={"column"}
                        gap={2}>
                        <Flex justifyContent={"space-between"} w={"full"}>
                            <Flex w={"full"} alignItems={"center"}>
                                <Text fontSize={"small"} fontWeight={"bold"}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        navigate(`/${user.username}`)

                                    }}>
                                    {user?.username}
                                </Text>
                                <Image src="/verified.png" w={4} h={4} ml={1} />
                            </Flex>
                            <Flex gap={4} alignItems={"center"}>
                                <Text fontSize={"xs"} color={"gray.light"} textAlign={'right'} whiteSpace={'nowrap'}>
                                    {formatDistanceToNow(new Date(post.createdAt))} ago
                                </Text>
                                {currentUser?._id === user._id && <DeleteIcon size={20} onClick={handleDeletePost} />}
                            </Flex>
                        </Flex>
                        <Text fontSize={"small"}>{post.text}</Text>
                        {post.img && (
                            <Box borderRadius={6}
                                overflow={"hidden"}
                                border={"1px solid"}
                                borderColor={"gray.light"}>
                                <Image src={post.img} w={"full"} />
                            </Box>
                        )
                        }
                        <Flex gap={3} my={1}>
                            <Actions post={post} />
                        </Flex>



                    </Flex>
                </Flex>
            </Link>
        </div >
    );
}

export default Post;
