import { Box, Flex, Skeleton, SkeletonCircle, Spinner } from "@chakra-ui/react"
import { useEffect, useState } from "react"
// import { Link } from 'react-router-dom'
import useShowToast from "../hooks/useShowToast"
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import SuggestedUsers from "../components/SuggestedUsers";

function HomePage() {
    const [posts, setPosts] = useRecoilState(postsAtom);
    const [loading, setLoading] = useState(true);

    const showToast = useShowToast();
    useEffect(() => {

        const getFeedPosts = async () => {
            setLoading(true)
            setPosts([]);
            try {
                const res = await fetch(`/api/posts/feed`);
                const data = await res.json()
                if (data.error) {
                    showToast('Error', data.error, 'error')
                    return;
                }
                setPosts(data)
            } catch (error) {
                showToast('Error', error, 'error')
            } finally {
                setLoading(false)
            }
        }
        getFeedPosts();
    }, [showToast, setPosts])

    return (
        <Flex gap={10} alignItems={'flex-start'}>
          <Box flex={70}>
          {!loading && posts.length == 0 &&
                (
                    <Flex mx={'auto'} p={5} justifyContent={'center'}>
                        <h1>Follow some users to see feed</h1>
                    </Flex>
                )}

            {loading &&
                <Flex justifyContent={'center'}
                    left={'50%'}
                    top={'30%'}
                    position={'absolute'}
                    transform={'translate(-50%)'}
                    zIndex={'5'}>
                    <Spinner size={'xl'} />
                </Flex>}
            {loading && (
                [0, 1, 2, 3].map((_, i) => (
                    <Flex key={i} gap={4} alignItems={'start'} p={'8'} borderRadius={'md'}>
                        <Box>
                            <SkeletonCircle size={'10'} />
                        </Box>

                        <Flex w={'full'} flexDirection={'column'} gap={3}>
                            <Skeleton h={'10px'} w={'80px'} />
                            <Skeleton h={'8px'} w={'100%'} />
                            <Skeleton h={'10px'} w={'100%'} />
                        </Flex>
                    </Flex>
                ))
            )}

            {posts.map((post) => (
                <Post key={post._id} post={post} postedBy={post.postedBy} />
            ))}
          </Box>
          <Box flex={30} display={{
            base: 'none',
            md: "block"
          }}>
            <SuggestedUsers/>
          </Box>
        </Flex>
    )
}

export default HomePage