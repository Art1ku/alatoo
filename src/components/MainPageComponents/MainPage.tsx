// MainPage.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import MainLeftNav from './MainPageComponents/ClassesLeftNavigation/MainLeftNav';
import ClassAboutInfo from './MainPageComponents/ClassAboutInformation/ClassAboutInfo';

export default function MainPage() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null); // Состояние для хранения выбранного элемента
  const [token, setToken] = useState<string>(''); // Обновлено на string (пустая строка вместо null)
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('accessToken'); // Получаем токен из cookies
    if (!token) {
      router.push('/login'); // Перенаправление на страницу входа, если токен отсутствует
    } else {
      setToken(token); // Устанавливаем токен в состояние
    }
  }, [router]);

  // Функция для обновления выбранного элемента
  const handleSelectItem = (item: string) => {
    setSelectedItem(item);
  };

  return (
    <>
      <div className="flex h-auto">
        <MainLeftNav onSelect={handleSelectItem} /> {/* Передача функции в MainLeftNav */}
        {/* Передаем оба selectedItem и token в ClassAboutInfo */}
        <ClassAboutInfo selectedItem={selectedItem} token={token} />
      </div>
    </>
  );
}
