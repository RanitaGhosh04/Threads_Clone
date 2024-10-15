import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "../components/Actions";
import Comment from "../components/Comment";
import useGetUserProfile from "../hooks/useGetUserProfile";
import useShowToast from "../hooks/useShowToast";
import { useNavigate, useParams } from "react-router-dom";
import { DeleteIcon } from "@chakra-ui/icons";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";


const PostPage = () => {
  
  const { user, loading } = useGetUserProfile();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const showToast = useShowToast();
  const [fetchingPosts, setFetchingPosts] = useState(true);
  const { pid } = useParams()
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();

  const currentPost = posts[0];

  useEffect(() => {
		const getPosts = async () => {
			setPosts([])
			try {
				const res = await fetch(`/api/posts/${pid}`);
				const data = await res.json();
        if(data.error){
          showToast("Error",data.error,"error")
          return
        }
				// console.log(data);

        // array because in actions itis array by default
				setPosts([data]);
			} catch (error) {
				showToast("Error", error.message, "error");
				
			} 
     
		};

		getPosts();

	}, [showToast, pid, setPosts]);

  const handleDeletePost = async () => {
    // dont need any event object because it is not inside any link like in homepage
		try {
			if (!window.confirm("Are you sure you want to delete this post?")) return;

			const res = await fetch(`/api/posts/${currentPost._id}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			showToast("Success", "Post deleted", "success");

      // after deleting navigate to user profile page
			navigate(`/${user.username}`);
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};


  if (!user && loading) {
		return (
			<Flex justifyContent={"center"}>
				<Spinner size={"xl"} />
			</Flex>
		);
	}

  if (!user && !loading) return <h1>User not found</h1>;

  if(!currentPost) return null

  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src={user.profilePic} size={"md"} name="Mark Zuckerberg" />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>
             {user.username}
            </Text>
            <Image src="/verified.png" w="4" h={4} ml={4} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
							<Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"}>
							{formatDistanceToNow(new Date(currentPost.createdAt))} ago
							</Text>

							{currentUser?._id === user._id && <DeleteIcon size={20}    cursor={"pointer"} onClick={handleDeletePost} />}

						</Flex>
      </Flex>

      <Text my={3}>{currentPost.text}</Text>

      {currentPost.img && (
        <Box
        borderRadius={6}
        overflow={"hidden"}
        border={"1px solid"}
        borderColor={"gray.light"}
      >
        <Image src={post.img} w={"full"} />
      </Box>
      )}

      <Flex gap={3} my={3}>
        <Actions post={currentPost}/>
      </Flex>

			
			
      {/*Divider is line */}
        <Divider my={4} />

        <Flex justifyContent={"space-between"}>
				<Flex gap={2} alignItems={"center"}>
					<Text fontSize={"2xl"}>👋</Text>
					<Text color={"gray.light"}>Get the app to like, reply and post.</Text>
				</Flex>
				<Button>Get</Button>
			</Flex>

      <Divider my={4} />

      {/* passing props to get different comments */}
      {/*  */}

      {currentPost.replies.map((reply) => (
				<Comment
					key={reply._id}
					reply={reply}
					lastReply={reply._id === currentPost.replies[currentPost.replies.length - 1]._id}
				/>
			))}

    </>
  );
};

export default PostPage;
