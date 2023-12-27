import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import Home from './pages/Home';
import MessageList from './pages/MessageList';
import MessageToPerson from './pages/MessageToPerson';
import Portal from './pages/Portal';
import PostPost from './pages/PostPost';
import Post from './pages/PostView';
import Profile from './pages/Profile';
import Search from './pages/Search';
import ResultList from './pages/ResultList';
import Onboarding from './pages/Onboarding';
import Cookies from 'js-cookie';


function App() {
  

  return (
    <>
      <Router>
        <Routes>
          <Route path="/portal" element={<Portal />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/" element={<Home />} />
          <Route path="/messaging" element={<MessageList />} />
          <Route path="/messaging/id/:id" element={<MessageToPerson />} />
          <Route path="/post" element={<PostPost />} />
          <Route path="/post/id/:id" element={<Post />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/search" element={<Search />} />
          <Route path="/search/:id" element={<ResultList />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
