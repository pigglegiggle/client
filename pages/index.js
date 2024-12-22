import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Chatbox from "./components/Chatbox";

export default function Home() {
  const [user_id, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('http://localhost:5000/', {credentials: 'include',});
        const data = await res.json();
        if (!res.ok) {
          router.push('/login');
          return;
        }

        console.log(data);
        setUserId(data.id);
        setUsername(data.username);
      } catch (error) {
        console.log('error checking:',error.message);
        router.push('/login');
      }
      
    }

    checkSession();
  }, [router])
  
  console.log('id:',user_id)

  async function handleLogout() {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/users/logout', {
        method: 'POST',
        credentials: 'include',
      })
      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
        return;
      }

      router.push('/login');
    } catch(error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div>
      <div className="p-2">
        chat app

        <div className="flex items-center space-x-2 mb-2">
          <h1>Hello {username}</h1>
          <button className="bg-red-500 px-1 text-white" onClick={handleLogout} disabled={loading}>{loading ? 'Logging out...' : 'Logout'}</button>
        </div>
        <Chatbox userdata = {{
          id: user_id,
          username: username
        }} />
      </div>


      
    </div>
  );
}
