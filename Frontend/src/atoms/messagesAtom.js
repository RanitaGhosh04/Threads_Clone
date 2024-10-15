import { atom } from "recoil";

export const conversationsAtom = atom({
	key: "conversationsAtom",

    // as initially we are not going to have any conversation, so empty array
	default: [],
});

//for opening selected convo
export const selectedConversationAtom = atom({
	key: "selectedConversationAtom",
	default: {
		_id: "",

        // id of the user that we are chatting with
		userId: "",
		username: "",
		userProfilePic: "",
	},
});