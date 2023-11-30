import React, { ReactElement, useContext, useState } from "react";

interface ISnackbarContext {
	msg: string;
	isDisplayed: boolean;
	displayMsg: (msg: string) => void;
	onClose: (timer: number) => void;
}

export const SnackbarContext = React.createContext<
	ISnackbarContext | undefined
>(undefined);

interface SnackBarContextProps {
	children: ReactElement;
}

export function useSnackbarContext() {
	const context = useContext(SnackbarContext);
	if (context === undefined) {
		throw new Error(
			"useSnackbarContext must be withing SnackBarContextProvider",
		);
	}

	return context;
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
