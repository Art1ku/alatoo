'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const FaceIDLogin = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState('');  // Статус сканирования
  const router = useRouter();

  const handleFaceID = async () => {
    setIsScanning(true);

    // Здесь можно интегрировать реальный API для Face ID через WebAuthn
    // Для начала используем таймер, чтобы имитировать процесс
    setTimeout(() => {
      // Эмуляция успешного сканирования Face ID
      const isSuccess = Math.random() > 0.2; // 80% шанс на успешное сканирование

      if (isSuccess) {
        localStorage.setItem('authToken', 'fake-token'); // Сохраняем фейковый токен
        setTimeout(() => router.push('/'), 1000); // Перенаправление через 1 секунду после успешного входа
      } else {

      }

      setIsScanning(false);
    }, 2000); // Эмуляция времени сканирования в 2 секунды
  };

  return (
    <div>
      <button onClick={handleFaceID} disabled={isScanning}>
        {isScanning ? 'Сканирование...' : 'Использовать Face ID'}
      </button>

      {scanStatus && <p>{scanStatus}</p>} {/* Показываем статус сканирования */}
    </div>
  );
};

export default FaceIDLogin;
