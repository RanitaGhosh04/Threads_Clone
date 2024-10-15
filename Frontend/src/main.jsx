import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ChakraProvider } from '@chakra-ui/react'
import { extendTheme } from "@chakra-ui/theme-utils";
import { ColorModeScript } from "@chakra-ui/color-mode";
import { mode } from "@chakra-ui/theme-tools";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from 'recoil'
import { SocketContextProvider } from './context/SocketContext.jsx'

// operating systems (system for this guide) give user the option to choose from Light or Dark color mode.

// Browsers can access this value provided by the operating system, and subscribe to the changes.

// You can decide:
// Whether the initial value (used on the first visit or after storage reset) is decided by the system or the developer.

const styles = {
  // The global key in the styles object is a special property used by Chakra UI to define global CSS styles that apply across your entire application

  // The props argument is used by the mode function to determine the current color mode and apply the correct value accordingly.
	global: (props) => ({
		body: {

      // When the color mode is light, it uses "gray.800", which is a dark gray color.
			color: mode("gray.800", "whiteAlpha.900")(props),

      // When the color mode is dark, it uses "whiteAlpha.900", which is a very light, almost transparent white.
			bg: mode("gray.100", "#101010")(props),
		},
	}),
};


// Add your color mode config
const config = {
	initialColorMode: "dark",

  // If true, Chakra UI subscribes to changes in system color mode. If set to false, the app's color mode is detached from the system color mode. Default is false.
	useSystemColorMode: true,
};

const colors = {
	gray: {
		light: "#616161",
		dark: "#1e1e1e",
	},
};
// If you intend to customise the default theme object to match your design requirements, you need to extend the theme.

// Chakra UI provides an extendTheme function that deep merges the default theme with your customizations.
const theme = extendTheme({ config, styles, colors });

createRoot(document.getElementById('root')).render(

  // React.StrictMode renders every component twice (in the initial render), only in development.
  <StrictMode>
    <RecoilRoot>
    <BrowserRouter>

    <ChakraProvider theme={theme}>
    {/* The initial mode you'd like your app to start with when user visit the page for first time */}
    <ColorModeScript initialColorMode={theme.config.initialColorMode}/>
    <SocketContextProvider>
      <App/>
      </SocketContextProvider>
    </ChakraProvider>

    </BrowserRouter>
    </RecoilRoot>
  </StrictMode>,
)
