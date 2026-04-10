'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './login.css';

export default function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [show, setShow] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [cooldown, setCooldown] = useState(0);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (cooldown > 0) return; // ⛔ blok kalau masih cooldown

    if (!email || !password) {
      return setError('Semua field wajib diisi');
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return setError('Format email tidak valid');
    }

    try {
      setLoading(true);

      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // ✅ penting
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      // 🚨 HANDLE RATE LIMIT
      if (res.status === 429) {
        const retry = data.retryAfter || 60;

        const expireTime = Date.now() + retry * 1000;
        localStorage.setItem('cooldown_expire', expireTime.toString());

        setCooldown(retry);
        setError(data.message);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setError(data.message);
        setLoading(false);
        return;
      }

      // ✅ SUCCESS LOGIN
      router.push('/dashboard');
    } catch (err) {
      setError('Terjadi kesalahan');
      setLoading(false);
    }
  };

  useEffect(() => {
    const expire = localStorage.getItem('cooldown_expire');

    if (!expire) return;

    const remaining = Math.floor((parseInt(expire) - Date.now()) / 1000);

    if (remaining > 0) {
      setCooldown(remaining);
    } else {
      localStorage.removeItem('cooldown_expire');
    }
  }, []);

  useEffect(() => {
    if (cooldown <= 0) {
      localStorage.removeItem('cooldown_expire');
      return;
    }

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  return (
    <div className='container'>
      <div className='login-card'>
        <h2>Welcome Back</h2>
        <p className='subtitle'>Silakan login untuk melanjutkan</p>

        {error && <div className='error-box'>{error}</div>}

        <form onSubmit={handleLogin}>
          <div className='input-group'>
            <label>Email</label>
            <input
              type='email'
              placeholder='Masukkan email'
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || cooldown > 0}
            />
          </div>

          <div className='input-group'>
            <label>Password</label>
            <div className='password-wrapper'>
              <input
                type={show ? 'text' : 'password'}
                placeholder='Masukkan password'
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || cooldown > 0}
              />
              <span
                onClick={() => {
                  if (cooldown === 0) setShow(!show);
                }}
                style={{
                  cursor: cooldown > 0 ? 'not-allowed' : 'pointer',
                  opacity: cooldown > 0 ? 0.5 : 1,
                }}
              >
                {show ? 'Hide' : 'Show'}
              </span>
            </div>
          </div>

          <button type='submit' disabled={loading || cooldown > 0}>
            {cooldown > 0
              ? `Coba lagi dalam ${cooldown}s`
              : loading
                ? 'Loading...'
                : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
