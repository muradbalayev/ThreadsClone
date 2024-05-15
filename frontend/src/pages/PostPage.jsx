import { Avatar, Button, Divider, Image, Box, Flex, Text, Spinner } from "@chakra-ui/react"
import Actions from "../components/Actions"
import { useEffect } from "react"
import Comment from "../components/Comment";
import useGetUserProfile from "../hooks/useGetUserProfile";
import useShowToast from "../hooks/useShowToast";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { DeleteIcon } from "@chakra-ui/icons";
import postsAtom from "../atoms/postsAtom";

function PostPage() {
  const { user, loading } = useGetUserProfile();
  const [posts, setPosts] = useRecoilState(postsAtom);

  const currentUser = useRecoilValue(userAtom)
  const navigate = useNavigate();

  // Get post id from client
  const { pid } = useParams();
  console.log(pid)

  const showToast = useShowToast();
  const currentPost = posts[0];
  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();
        if (data.error) {
          showToast('Error', data.error, 'error')
          return;
        }
        console.log(data);
        setPosts([data])
      } catch (error) {
        showToast('Error', error, 'error')
      }
    }
    getPost()
  }, [pid, showToast, setPosts])

  const handleDeletePost = async (e) => {
    try {
      e.preventDefault()
      if (!window.confirm("Are you sure you want to delete this post?")) return;

      const res = await fetch(`/api/posts/${currentPost._id}`, {
        method: "DELETE"
      })
      const data = await res.json();
      if (data.error) {
        showToast('Error', data.error, 'error')
        return
      }
      showToast('Success', "Post deleted!", 'success')
      navigate(`/${user.username}`);
    } catch (error) {
      showToast('Error', error, 'error')
    }
  }

  if (!user && loading) {
    return (
      <Flex justifyContent={'center'}>
        <Spinner size={'xl'} />
      </Flex>
    )
  }

  if (!currentPost) return (<h1>There are no post</h1>);

  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar name='sad' src={user.profilePic} size={"md"} />
          <Flex alignItems={"center"}>
            <Text fontSize={'small'} fontWeight={"bold"}>{user.username}</Text>
            <Image w={4} h={4} ml={2} src="/verified.png" />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text fontSize={"xs"} color={"gray.light"} textAlign={'right'} whiteSpace={'nowrap'}>
            {formatDistanceToNow(new Date(currentPost.createdAt))} ago
          </Text>
          {currentUser?._id === user._id && <DeleteIcon cursor={'pointer'} size={20} onClick={handleDeletePost} />}
        </Flex>
      </Flex>

      <Text my={3}>{currentPost.text} </Text>
      {currentPost.img && (
        <Box borderRadius={6}
          overflow={"hidden"}
          border={"1px solid"}
          borderColor={"gray.light"}>
          <Image src={currentPost.img} w={"full"} />
        </Box>
      )}
      <Flex gap={3} my={3}>
        <Actions post={currentPost} />
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
      {currentPost.replies.map((reply) => (
        <Comment
          key={posts._id}
          reply={reply}
          // If its last dont add divider
          lastReply={reply._id === currentPost.replies[currentPost.replies.length - 1]._id}
        />
      ))}


    </>
  )
}

export default PostPage