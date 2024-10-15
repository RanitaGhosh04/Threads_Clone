// In the client we are creating a context

import { createContext, useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import io from "socket.io-client";
import userAtom from "../atoms/userAtom";

// creating a context
const SocketContext = createContext();

// hook to use the socket
export const useSocket = () => {
	return useContext(SocketContext);
};


// context provider, which takes a children as a prop
export const SocketContextProvider = ({ children }) => {

    
	const [socket, setSocket] = useState(null);
	
	const user = useRecoilValue(userAtom);

    const [onlineUsers, setOnlineUsers] = useState([]);

    // to connect to socket server
	useEffect(() => {
		const socket = io("http://localhost:5000", {
			query: {

                // if we have a user logged in, send the id of that user
				userId: user?._id,
			},
		});

		setSocket(socket);

        // listening to event sent from socket
        socket.on("getOnlineUsers", (users) => {
			setOnlineUsers(users);
		});

    // cleanup function once the component unmounts for disconnection of socket
		return () => socket && socket.close();
	}, [user?._id]);

    console.log(onlineUsers);

	return <SocketContext.Provider value={{socket,onlineUsers}}>{children}</SocketContext.Provider>;
};