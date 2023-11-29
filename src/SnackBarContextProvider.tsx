import React, { ReactElement, useState } from "react";

export const SnackbarContext = React.createContext({
	msg: "",
	isDisplayed: false,
	displayMsg: (msg: string) => {},
	onClose: (timer: number) => {},
});

interface SnackBarContextProps {
	children: ReactElement;
}

export function SnackBarContextProvider(props: SnackBarContextProps) {
	const [msg, setMsg] = useState("");
	const [isDisplayed, setIsDisplayed] = useState(false);

	function displayHandler(msg: string) {
		setMsg(msg);
		setIsDisplayed(true);
		const time = setTimeout(() => {
			closeHandler(time);
		}, 3000); // close snackbar after 3 seconds
	}
	function closeHandler(timer: number) {
		clearTimeout(timer);
		setIsDisplayed(false);
	}

	return (
		<SnackbarContext.Provider
			value={{
				msg,
				isDisplayed,
				displayMsg: displayHandler,
				onClose: closeHandler,
			}}
		>
			{props.children}
		</SnackbarContext.Provider>
	);
}
