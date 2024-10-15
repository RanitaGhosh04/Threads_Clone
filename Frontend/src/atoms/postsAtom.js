import { atom } from "recoil";

const postsAtom = atom({
	key: "postsAtom",

    // by default posts will be an array
	default: [],
});

export default postsAtom;