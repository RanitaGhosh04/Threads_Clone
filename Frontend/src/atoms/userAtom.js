import { atom } from "recoil";

const userAtom = atom({
	key: "userAtom",

    // whatever user present in localstorage will be homepage
	default: JSON.parse(localStorage.getItem("user-threads")),
});

export default userAtom;