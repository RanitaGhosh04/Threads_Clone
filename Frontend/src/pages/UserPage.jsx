import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader"
import UserPost from "../components/UserPost"
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner, Text } from "@chakra-ui/react";
import Post from "../components/Post"
import useGetUserProfile from "../hooks/useGetUserProfile"
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";

const UserPage = () => {
  // const [user,setUser] = useState(null)
  const { username } = useParams();
  const showToast = useShowToast();
  // const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useRecoilState(postsAtom) //post1,post2,post3
  const [fetchingPosts, setFetchingPosts] = useState(true);
  const { user, loading } = useGetUserProfile();
  useEffect(() => {
    // get the posts to map and show on feed
    const getPosts = async () => {
			if (!user) return;
			setFetchingPosts(true);
			try {
				const res = await fetch(`/api/posts/user/${username}`);
				const data = await res.json();
				// console.log(data);
				setPosts(data);
			} catch (error) {
				showToast("Error", error.message, "error");
				setPosts([]);
			} finally {
				setFetchingPosts(false);
			}
		};

    getPosts();

	}, [username,showToast,setPosts,user]); 

  if (!user && loading) {
		return (
			<Flex justifyContent={"center"}>
				<Spinner size={"xl"} />
			</Flex>
		);
	}

  if (!user && !loading) return <h1>User not found</h1>;

  // show spinner
  {fetchingPosts && (
    <Flex justifyContent={"center"} my={12}>
      <Spinner size={"xl"} />
    </Flex>
  )}

  // map the posts
  {posts?.map((post) => (
   <Post key={post._id} post={post} postedBy={post.postedBy} />
  ))}

  return (
    <>
       <UserHeader user={user} />

{!fetchingPosts && posts.length === 0 && <h1>User has not posts.</h1>}
{fetchingPosts && (
  <Flex justifyContent={"center"} my={12}>
    <Spinner size={"xl"} />
  </Flex>
)}

{posts.map((post) => (
  <Post key={post._id} post={post} postedBy={post.postedBy} />
))}
    </>
  )
}

export default UserPage