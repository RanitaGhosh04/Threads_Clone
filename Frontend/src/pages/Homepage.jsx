import { Flex, Button, Box, Spinner } from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import { useEffect, useState } from "react";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import SuggestedUser from "../components/SuggestedUsers";
import SuggestedUsers from "../components/SuggestedUsers";

const HomePage = () => {

    const [posts, setPosts] = useRecoilState(postsAtom);
	const [loading, setLoading] = useState(true);
	const showToast = useShowToast();

    // fetch the posts of the users that I follow
	useEffect(() => {
		const getFeedPosts = async () => {
			setLoading(true);

			// before fetching feed posts, set the posts to an empty array
			// so the our own post dont appear on the feed
			setPosts([])
			try {
				const res = await fetch("/api/posts/feed");
				const data = await res.json();

                // console.log(data);
				setPosts(data);

				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setLoading(false);
			}
		};
		getFeedPosts();
	}, [showToast, setPosts]);

return (
    <Flex gap='10' alignItems={"flex-start"}>
        <Box flex={70}>
				{!loading && posts.length === 0 && <h1>Follow some users to see the feed</h1>}

				{loading && (
					<Flex justify='center'>
						<Spinner size='xl' />
					</Flex>
				)}

				{posts.map((post) => (
					<Post key={post._id} post={post} postedBy={post.postedBy} />
				))}
			</Box>

			<Box
				flex={30}
				display={{
					base: "none",
					md: "block",
				}}
			>
				<SuggestedUsers/>
			</Box>
    </Flex>
);
};

export default HomePage;