// Atoms are units of state that can be shared across components

import { atom } from "recoil";

const authScreenAtom = atom({

    //  current authentication screen
	key: "authScreenAtom",

    // by default this is a login page
	default: "login",
});

export default authScreenAtom;