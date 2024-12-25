'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import MainLeftNav from './MainPageComponents/ClassesLeftNavigation/MainLeftNav';
import ClassAboutInfo from './MainPageComponents/ClassAboutInformation/ClassAboutInfo';

export default function MainPage() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null); // Состояние для хранения выбранного элемента
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login'); // Перенаправление на страницу входа, если токен отсутствует
    }
  }, [router]);

  // Функция для обновления выбранного элемента
  const handleSelectItem = (item: string) => {
    setSelectedItem(item);
  };

  return (
    <>
      <div className="flex h-auto">
        <MainLeftNav onSelect={handleSelectItem} />  {/* Передача функции в MainLeftNav */}
        <ClassAboutInfo selectedItem={selectedItem} />  {/* Передача выбранного элемента в ClassAboutInfo */}
      </div>
    </>
  );
}
