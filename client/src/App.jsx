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
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            <Route path="/showsong/mostpopular" element={<MostPopularSong />} />
            <Route path="/showvideo/mostpopular" element={<MostPopularVideo />} />

          </Routes>

          {openplayer && type === "audio" &&
            <div className='fixed bottom-0 w-full bg-black h-[70px] p-2'>
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
