import { useState } from "react"
import styled, { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./utils/Themes"
import Sidebar from "./components/Sidebar";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from "./pages/Dashboard";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import VerifyOtp from "./components/VerifyOtp";
import Upload from "./pages/Upload";
import Profile from "./pages/Profile";
import { useSelector } from "react-redux";
import AudioPlayer from "./components/AudioPlayer";
import MostPopularSong from "./pages/MostPopularSong";
import PrivateRoute from "./components/PrivateRoute";
import AdminPrivate from "./components/AdminPrivate";
import MostPopularVideo from "./pages/MostPopularVideo";
import { Modal } from "@mui/material";
import VideoPlayer from "./components/VideoPlayer";
import Search from "./pages/Search";
import ShowSongCategory from "./pages/ShowSongCategory";
import Favourites from "./pages/Favourites";


const Container = styled.div`
  background:${({ theme }) => theme.bg};
  width:100%;
  height:100vh;
  display:flex;
  overflow-x:hidden;
  overflow-y:hidden;
  // color:white;
`;



function App() {
  const [darkMode, setDarkMode] = useState(true);
  const { openplayer, type, modalOpen } = useSelector(state => state.audioplayer);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <BrowserRouter>
        <Container>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify" element={<VerifyOtp />} />
            <Route path="/upload" element={
              <AdminPrivate>
                <Upload />
              </AdminPrivate>
            } />
            <Route path="/profile/:id" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            <Route path="/showsong/mostpopular" element={<MostPopularSong />} />
            <Route path="/showvideo/mostpopular" element={<MostPopularVideo />} />
            <Route path="/search" element={<Search />} />
            <Route path="/favourites" element={<Favourites />} />
            <Route path="/showsongs/:category" element={<ShowSongCategory />} />

          </Routes>

          {openplayer && type === "audio" &&
            <div className='fixed bottom-0 w-full bg-black h-[65px] p-2 z-50'>
              <AudioPlayer />
            </div>
          }

          {openplayer && type === "video" &&
            <VideoPlayer />
          }


        </Container>
      </BrowserRouter>
    </ThemeProvider >
  )
}

export default App
