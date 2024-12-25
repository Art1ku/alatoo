import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap'; 
import classes from './Header.module.scss';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null); 
  const userWrapperRef = useRef<HTMLDivElement>(null); 

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); 
  };

  const handleLogout = () => {
    console.log('Выход из системы');
    localStorage.removeItem('authToken'); 
    localStorage.removeItem('refreshToken'); // Удаление refresh token
    localStorage.removeItem('username'); // Удаление имени пользователя при выходе
    window.location.href = '/login'; 
  };

  const login = async (username: string, password: string) => {
    const response = await fetch('/api/v1/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        username,
        password,
        grant_type: 'password',
      }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('authToken', data.access_token);
      localStorage.setItem('refreshToken', data.refresh_token);
      localStorage.setItem('username', username);
      setUsername(username);
    } else {
      console.error('Login failed');
    }
  };

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      console.error('No refresh token available');
      return;
    }

    const response = await fetch('/api/v1/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('authToken', data.access_token);
      localStorage.setItem('refreshToken', data.refresh_token);
    } else {
      console.error('Token refresh failed');
    }
  };

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No auth token found');
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Если токен истек, обновляем его
      await refreshToken();
      // После обновления токенов можно попробовать запрос снова
      return fetchWithAuth(url, options);
    }

    return response;
  };

  useEffect(() => {
    // Загружаем имя пользователя из localStorage
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }

    if (isMenuOpen && menuRef.current) {
      gsap.fromTo(
        menuRef.current,
        { x: 300, opacity: 0 }, 
        { x: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
    } else if (!isMenuOpen && menuRef.current) {
      gsap.to(menuRef.current, {
        x: 300,  
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          if (menuRef.current) {
            menuRef.current.style.display = 'none';
          }
        },
      });
    }
  }, [isMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(event.target as Node) &&
        userWrapperRef.current && !userWrapperRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false); 
      }
    };

    document.addEventListener('click', handleClickOutside); 

    return () => {
      document.removeEventListener('click', handleClickOutside); 
    };
  }, []);

  return (
    <div className={classes.wrapper}>
      <div className={classes.insideWrapper}>
        <div className={classes.logoWrapper}>
          <div className={classes.logos}>
            <div className={classes.logo}></div>
            <div className={classes.logoBack}></div>
          </div>
          <div className={classes.logoPWrapper}>
            <p className={classes.logoP1}>ADMIN</p>
            <p className={classes.logoP2}>PANEL</p>
          </div>
        </div>
        <div className={classes.divider}></div>
        <div className={classes.headerNav}>
          <div
            className={classes.userWrapper}
            ref={userWrapperRef} 
            onClick={toggleMenu}
          >
            <div className={classes.avatar}>
              <div className={classes.avatarImage}></div>
            </div>
            <p className={classes.userName}>{username || 'Имя пользователя'}</p>
          </div>

          {isMenuOpen && (
            <div
              className={classes.dropdownMenu}
              ref={menuRef} 
              style={{ display: 'block' }} 
            >
              <button className={classes.logoutButton} onClick={handleLogout}>
                <p className={classes.buttonP}>Выйти</p>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
