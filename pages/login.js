import React, {useState} from 'react'
import { useRouter } from "next/navigation";
function login() {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const router = useRouter();
    async function handleLogin(e) {
        e.preventDefault();

        setLoading(true);
        try {

            const res = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username: username}),
                credentials: 'include',
            });

            const result = await res.json();
            if (!res.ok) {
                setError(result.message);
                return;
            }

            console.log(result);
            setResponse(result.message);

            router.push('/');

        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false);
            setUsername('');
        }
    }
  return (
    <div>
        login
        {error && 
            <h1 className='text-red-500'>{error}</h1>
        }
        {response && 
            <h1 className='text-green-500'>{response}</h1>
        }
        <form onSubmit={handleLogin}>
            <input className='border px-1' placeholder='username' type='text' value={username} onChange={(e) => setUsername(e.target.value)}/>
            <button className='px-1 border bg-blue-500 text-white' type='submit' disabled={loading}>{ loading ? 'loading' : 'login' }</button>
        </form>
    </div>
  )
}

export default login