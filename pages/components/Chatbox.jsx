import React, { useEffect, useState, useRef } from 'react'

function Chatbox({userdata}) {
  const [msg, setMsg] = useState('');
  const [socketMsg, setSocketMsg] = useState('');
  const socketRef = useRef(null);
  const [chat, setChat] = useState([]);
  const scrolling = useRef(null);
  const [userColors, setUserColors] = useState(new Map());

  const generateRandomColor = (username) => {
    if (userColors.has(username)) {
      // Return the existing color if it was already generated for this user
      return userColors.get(username);
    }

    // Generate a random color in hex format (e.g., #ff5733)
    const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

    // Update state using the previous userColors state to ensure a new object is created
    setUserColors((prevUserColors) => new Map(prevUserColors).set(username, color));

    return color;
  };
  
  useEffect(() => {
    async function loadChatHistory() {
      try {
        const res = await fetch('http://localhost:5000/message', {credentials: 'include',});
        const data = await res.json();
        if (!res.ok) {
          return;
        }

        console.log(data);
        setChat(data);
      } catch (error) {
        console.log('error checking:',error.message);
      }
    }
    loadChatHistory();
  }, [])
  
  useEffect(() => {
    socketRef.current = new WebSocket('ws://localhost:8080');

    socketRef.current.addEventListener('open', () => {
      console.log('Connected to WebSocket server.');
    });
  
  
    socketRef.current.addEventListener('message', (e) => {
      const data = JSON.parse(e.data)
      
      setChat((prevChat) => [
        ...prevChat,
        {
          id: data.id,
          username: data.username,
          message: data.message,
        }
      ]);
    });
  
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [])

  function handleSendMsg(e) {
    e.preventDefault();
    const data = {
      userdata,
      message: msg,
    };
    if (socketRef.current && msg) {
      socketRef.current.send(JSON.stringify(data))
      setMsg('');
    }
    
  }

  useEffect(() => {
    const scrollChat = scrolling.current;
    if(scrollChat) {
      scrollChat.scrollTop = scrollChat.scrollHeight;
    }
  }, [chat])

  return (
    <div className='border inline-block p-1 '>
        chatbox
        <div className='overflow-y-scroll h-full scroll-smooth min-h-[200px] max-h-[200px] hide-scrollbar' ref={scrolling}>
          <div className=''>
            {chat.map((chatmsg, index) => {
              const color = generateRandomColor(chatmsg.username);
              return (
                <div key={`${chatmsg.id}-${index}`} className="flex space-x-2">
                  <span style={{ color }} className="font-semibold">{chatmsg.username}:</span>
                  <p>{chatmsg.message}</p>
                </div>
              )
            })}
          </div>
        </div>

        <form onSubmit={handleSendMsg}>
            <input value={msg} onChange={(e) => setMsg(e.target.value)} className='border focus:ring-0 focus:outline-none' type='text' placeholder='enter a message' />
            <button className='border text-white bg-blue-500 px-1 ' type='submit'>Send</button>
        </form>
    </div>

  )
}

export default Chatbox;