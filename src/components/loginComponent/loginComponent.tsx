'use client';
import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './loginComponent.module.scss';
import { useRouter } from 'next/navigation';

const LoginComponent = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }
      );
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/v1/token', {
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

      const data = await response.json();

      if (response.ok) {
        // Сохраняем токены в localStorage
        localStorage.setItem('accessToken', data.access_token);
        localStorage.setItem('refreshToken', data.refresh_token);

        router.push('/'); // Перенаправление на главную страницу
      } else {
        alert('Неверные данные для входа');
      }
    } catch (error) {
      console.error('Ошибка входа:', error);
      alert('Произошла ошибка. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        throw new Error('Отсутствует Refresh Token');
      }

      const response = await fetch('http://localhost:8000/api/v1/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }), // Передаем refresh_token в теле запроса
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('accessToken', data.access_token);
      } else {
        alert('Не удалось обновить токен. Пожалуйста, войдите снова.');
        router.push('/login'); // Перенаправление на страницу входа
      }
    } catch (error) {
      console.error('Ошибка обновления токена:', error);
      router.push('/login'); // Перенаправление на страницу входа
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Вход в систему</h1>

        <div ref={formRef} className={styles.formContainer}>
          <form className={styles.form} onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Логин"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;









































// 'use client';
// import { useState, useEffect, useRef } from 'react';
// import { gsap } from 'gsap';
// import styles from './loginComponent.module.scss';
// import FaceIDLogin from '../FaceID/FaceIDLogin';
// import { useRouter } from 'next/navigation';

// const LoginComponent = () => {
//   const [isFaceID, setIsFaceID] = useState(false);
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const formRef = useRef<HTMLDivElement>(null);
//   const router = useRouter();

//   useEffect(() => {
//     if (formRef.current) {
//       gsap.fromTo(
//         formRef.current,
//         { opacity: 0, x: isFaceID ? 50 : -50 },
//         { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }
//       );
//     }
//   }, [isFaceID]);

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await fetch('/api/v1/auth/token', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: new URLSearchParams({
//           username,
//           password,
//           grant_type: 'password',
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         // Сохраняем токены в localStorage
//         localStorage.setItem('accessToken', data.access_token);
//         localStorage.setItem('refreshToken', data.refresh_token);

//         router.push('/'); // Перенаправление на главную страницу
//       } else {
//         alert('Неверные данные для входа');
//       }
//     } catch (error) {
//       console.error('Ошибка входа:', error);
//       alert('Произошла ошибка. Попробуйте снова.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const refreshAccessToken = async () => {
//     try {
//       const refreshToken = localStorage.getItem('refreshToken');

//       if (!refreshToken) {
//         throw new Error('Отсутствует Refresh Token');
//       }

//       const response = await fetch('/api/v1/auth/refresh', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ refresh_token: refreshToken }), // Передаем refresh_token в теле запроса
//       });

//       const data = await response.json();

//       if (response.ok) {
//         localStorage.setItem('accessToken', data.access_token);
//       } else {
//         alert('Не удалось обновить токен. Пожалуйста, войдите снова.');
//         router.push('/login'); // Перенаправление на страницу входа
//       }
//     } catch (error) {
//       console.error('Ошибка обновления токена:', error);
//       router.push('/login'); // Перенаправление на страницу входа
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <div className={styles.card}>
//         <h1 className={styles.title}>Вход в систему</h1>
//         <div className={styles.toggle}>
//           <button onClick={() => setIsFaceID(false)} className={!isFaceID ? styles.active : ''}>
//             Логин и пароль
//           </button>
//           <button onClick={() => setIsFaceID(true)} className={isFaceID ? styles.active : ''}>
//             Face ID
//           </button>
//         </div>

//         <div ref={formRef} className={styles.formContainer}>
//           {isFaceID ? (
//             <div className={styles.faceID}>
//               <div className={styles.faceIDIcon}></div>
//               <FaceIDLogin />
//             </div>
//           ) : (
//             <form className={styles.form} onSubmit={handleLogin}>
//               <input
//                 type="text"
//                 placeholder="Логин"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 required
//               />
//               <input
//                 type="password"
//                 placeholder="Пароль"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//               <button type="submit" disabled={loading}>
//                 {loading ? 'Вход...' : 'Войти'}
//               </button>
//             </form>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginComponent;
