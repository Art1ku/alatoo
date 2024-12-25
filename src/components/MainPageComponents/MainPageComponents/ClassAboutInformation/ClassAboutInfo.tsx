'use client';
import { useState, useEffect } from 'react';
import classes from './ClassAboutInfoStyle.module.scss';
import Header from '@/components/Header/Header';
import domain from "@/app/config";

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
