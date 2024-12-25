'use client';
import { useState, useEffect } from 'react';
import classes from './ClassAboutInfoStyle.module.scss';
import Header from '@/components/Header/Header';

interface Student {
  id: string;
  full_name: string;
  validated: boolean;
}

interface ClassAboutInfoProps {
  selectedItem: string | null;
  token: string; // Добавляем токен как пропс
}

export default function ClassAboutInfo({ selectedItem, token }: ClassAboutInfoProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedItem) {
      const fetchStudents = async () => {
        setLoading(true);
        try {
          // Выполняем запрос к API с Bearer токеном в заголовке
          const response = await fetch('/api/v1/student/', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`, // Bearer токен
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            const errorText = await response.text(); // Получаем тело ответа при ошибке
            throw new Error('Ошибка при получении данных');
          }

          const data = await response.json();

          // Фильтруем студентов в зависимости от selectedItem
          const filteredStudents =
            selectedItem === 'all'
              ? data
              : data.filter(
                  (student: Student) => student.validated === (selectedItem === 'validated')
                );

          setStudents(filteredStudents);
        } catch (error: any) {
          setStudents([]);
        } finally {
          setLoading(false);
        }
      };

      fetchStudents();
    }
  }, [selectedItem, token]); // Добавляем токен в зависимость

  return (
    <div className={classes.wrapper}>
      <Header />
      <div className={classes.insideWrapper}>
        <div className={classes.insideBorders}>
          {loading ? (
            <p>Загрузка...</p>
          ) : (
            students.map((student) => (
              <div key={student.id} className={classes.card}>
                <h3>{student.full_name}</h3>
                <p>{student.validated ? 'Потверждён' : 'Не потверждён'}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
