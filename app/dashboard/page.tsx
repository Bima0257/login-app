'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import '../dasboard.css';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  const handleLogout = async () => {
    await fetch('/api/logout', {
      method: 'POST',
    });

    router.push('/');
  };

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch('/api/me');

      if (!res.ok) {
        router.push('/');
        return;
      }

      const data = await res.json();
      setUser(data);
    };

    fetchUser();
  }, []);

  return (
    <div className='layout'>
      {/* SIDEBAR */}
      <aside className='sidebar'>
        <h2 className='logo'>MyApp</h2>
        <ul>
          <li className='active'>Dashboard</li>
          <li>User</li>
          <li>Settings</li>
        </ul>
      </aside>

      {/* MAIN */}
      <div className='main'>
        {/* NAVBAR */}
        <nav className='navbar'>
          <h3>Dashboard</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {user && <span>Hi, {user.username}</span>}
            <button onClick={handleLogout}>Logout</button>
          </div>
        </nav>

        {/* CONTENT */}
        <div className='content'>
          <div className='card'>
            <h2>Welcome </h2>
            <p>{user ? `Selamat datang, ${user.username}!` : 'Loading...'}</p>
          </div>

          <div className='grid'>
            <div className='mini-card'>Total User: 10</div>
            <div className='mini-card'>Active: 8</div>
            <div className='mini-card'>Inactive: 2</div>
          </div>
        </div>
      </div>
    </div>
  );
}
