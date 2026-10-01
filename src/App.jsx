import { useState, useEffect } from "react";
import { data } from "react-router";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('https://nwoawxvbarblzgrfedqa.supabase.co/rest/v1/users', {
      headers: {
        'apikey': 'sb_publishable_-IvrLhxd_oVx-WaZZkFWwA_0H-FH-Vj'
      }
    })
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  return (
    <>
      <h1>MyCoach</h1>
    </>
  )
}

export default App
