import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./assets/styles/base/fonts.css";
import "./assets/styles/base/reset.css";
import { Routers } from "./routers/Routers";
import ChatBox from './components/chat/ChatBox';

function App() {
  return (
    <>
      <Routers/>
      <ChatBox />
    </>
  )
}

export default App
