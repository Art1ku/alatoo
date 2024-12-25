'use client';
import { useState, useEffect, useRef } from 'react';
import classes from './MainLeftNavStyle.module.scss';
import domain from "@/app/config";
import Cookies from 'js-cookie';

export default function MainLeftNav({ onSelect }: { onSelect: (status: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [modalData, setModalData] = useState<string | null>(null);
  const [studentData, setStudentData] = useState<any | null>(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 1000);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen && isMobile) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, isMobile]);

  const menuItems = [
    { label: 'Все студенты', status: 'all' },
    { label: 'Потвержденные студенты', status: 'validated' },
    { label: 'Не потвержденные студенты', status: 'not_validated' },
    { label: 'Найти студента', status: 'find_student' },
  ];

  const refreshAccessToken = async () => {
    try {
      const refreshToken = Cookies.get('refreshToken'); // Используем cookies для получения refreshToken
      if (!refreshToken) {
        throw new Error('Отсутствует Refresh Token');
      }

      const response = await fetch(domain+ '/api/v1/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      const data = await response.json();

      if (response.ok) {
        Cookies.set('accessToken', data.access_token, { expires: 1 }); // Сохраняем новый accessToken в cookies
        return data.access_token;
      } else {
        alert('Не удалось обновить токен. Пожалуйста, войдите снова.');
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        window.location.href = '/login';
        return null;
      }
    } catch (error) {
      console.error('Ошибка обновления токена:', error);
      window.location.href = '/login';
      return null;
    }
  };

  const getAccessToken = async () => {
    let token = Cookies.get('accessToken'); // Получаем accessToken из cookies
    if (!token) {
      token = await refreshAccessToken();
    }
    return token;
  };

  const handleStudentImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('photo', file);

    try {
      let accessToken = await getAccessToken();

      if (!accessToken) {
        alert('Не удалось получить токен. Пожалуйста, войдите снова.');
        return;
      }

      const response = await fetch(domain+'/api/v1/student', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Ошибка загрузки изображения');

      const data = await response.json();
      setStudentData(data);
      setModalData('Информация о студенте');
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Не удалось найти студента');
    }
  };

  const handleModalClose = () => setModalData(null);

  return (
    <>
      {isMobile && !isOpen && (
        <button className={classes.menuButton} onClick={() => setIsOpen(true)}>
          ☰
        </button>
      )}

      {isMobile && isOpen && (
        <div className={classes.overlay} onClick={() => setIsOpen(false)} />
      )}

      <div
        ref={navRef}
        className={`${classes.navContainer} ${isOpen || !isMobile ? classes.open : ''}`}
      >
        <div className={classes.topBlock}>
          <p className={classes.topBlockP}>Навигация</p>
        </div>
        <div className={classes.divider}></div>
        <nav>
          <ul className={classes.navList}>
            {menuItems.map(({ label, status }, index) => (
              <li
                key={index}
                className={classes.navItem}
                onClick={() => {
                  onSelect(status);
                  setIsOpen(false);
                  if (status === 'find_student') {
                    document.getElementById('fileInput')?.click();
                  }
                }}
              >
                {label}
              </li>
            ))}
          </ul>
        </nav>

        <input
          type="file"
          id="fileInput"
          accept="image/*"
          onChange={handleStudentImage}
          style={{ display: 'none' }}
        />
      </div>

      {modalData && studentData && (
        <div className={classes.modalOverlay}>
          <div className={classes.modal}>
            <button className={classes.closeButton} onClick={handleModalClose}>
              ✖
            </button>
            <h2>{modalData}</h2>
            <p>
              <strong>ID:</strong> {studentData.id}
            </p>
            <p>
              <strong>ФИО:</strong> {studentData.full_name}
            </p>
            <p>
              <strong>Статус:</strong> {studentData.validated ? 'Потверждён' : 'Не потверждён'}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
