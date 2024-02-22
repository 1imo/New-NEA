import { useContext, useState } from 'react'
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
import Settings from './pages/Settings';
import { Context } from './context/Context';
import NotFound from './pages/404';
import SignIn from './pages/SignIn';


function App() {
  const Ctx = useContext(Context)
  

  return (
    <>
      <Router>
        <Routes>
          <Route path="/portal" element={<Portal />} />
          <Route path="/sign_in" element={<SignIn />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/post/id/:id" element={<Post />} />
          {Ctx.id && Ctx.secretkey && (
            <>
            <Route path="/" element={<Home />} />
            <Route path="/messaging" element={<MessageList />} />
            <Route path="/messaging/id/:id" element={<MessageToPerson />} />
            <Route path="/post" element={<PostPost />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/search" element={<Search />} />
            <Route path="/search/:id" element={<ResultList />} />
            <Route path="/settings" element={<Settings />} />
            </>
          )}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
