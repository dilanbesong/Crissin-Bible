import {
  AppShell,
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
} from "@mantine/core";
import { useDisclosure, useLocalStorage, useWindowEvent } from "@mantine/hooks";
import MyNavbar from "./components/MyNavbar";
import MyHeader from "./components/MyHeader";
import { useState, useEffect } from "react";
import Passage from "./components/Passage";
import { SearchModal } from "./components/SearchModal";
import { Routes, Route } from "react-router-dom";
import { LandingPage } from "./LandingPage";
//import Offline from "./components/Offline";

export default function App() {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "color-scheme",
    defaultValue: "dark",
  });
  const toggleColorScheme = () =>
    setColorScheme((current) => (current === "dark" ? "light" : "dark"));
  const [opened, setOpened] = useState(false);
  const [modalOpened, modalFn] = useDisclosure(false);
  useWindowEvent("keydown", (event) => {
    if (event.key === "/") {
      event.preventDefault();
      modalFn.open();
    }
    if (event.key === "Escape") {
      event.preventDefault();
      modalFn.close();
    }
  });
  const [ isOnline, setIsOnline] = useState(window.navigator.onLine)

  useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Cleanup event listeners on component unmount
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);
  return (
    <Routes>
      <Route path="/" element={ isOnline ? <LandingPage/> : <LandingPage/> }/>
      <Route path="/bible" element={
        <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme }}
        withGlobalStyles
        withNormalizeCSS
      >
        <AppShell
          padding="md"
          navbar={<MyNavbar opened={opened} setOpened={setOpened} />}
          header={
            <MyHeader
              colorScheme={colorScheme}
              toggleColorScheme={toggleColorScheme}
              opened={opened}
              setOpened={setOpened}
              open={modalFn.open}
            />
          }
          styles={(theme) => ({
            main: {
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[8]
                  : theme.colors.gray[0],
              height: "100vh",
            },
          })}
        >
          <Passage open={modalFn.open} />
          <SearchModal opened={modalOpened} close={modalFn.close} />
        </AppShell>
      </MantineProvider>
    </ColorSchemeProvider>
      }/>

    
    </Routes>
  );
}
