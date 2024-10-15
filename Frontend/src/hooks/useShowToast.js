import { useToast } from "@chakra-ui/toast";
import { useCallback } from "react";


// used usecallback beacuse showToast is a function, which is object, and on every render needs different memory slots.
const useShowToast = () => {
	const toast = useToast();

	const showToast = useCallback(
		(title, description, status) => {
			toast({
				title,
				description,
				status,
				duration: 3000,
				isClosable: true,
			});
		},
		[toast]
	);

	return showToast;
};

export default useShowToast;