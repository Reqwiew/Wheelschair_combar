import './App.css';
import whils from './img.png';
import huhcoin from './Huhs.png';

import React, {useEffect, useState} from 'react';


function App() {
    const tg = window.Telegram.WebApp;
    const [clickCount, setClickCount] = useState(0);
    const [flyText, setFlyText] = useState([]);

    useEffect(() => {
        fetch(`https://mint-mosquito-gratefully.ngrok-free.app/getCoins?user_id=${tg.initDataUnsafe.user.id}`, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                setClickCount(data.balance)
            })
            .catch((error) => console.log(error));
    }, []);

    // Обработчик клика
    const handleClick = () => {
        fetch(`https://mint-mosquito-gratefully.ngrok-free.app/addCoins`, {
            method: "POST",
            body: JSON.stringify({
                user_id: tg.initDataUnsafe.user.id,
                coins: 1
            })
        })
            .then((response) => response.json())
            .then((data) => {
                setClickCount(data.balance);
            })
            .catch((error) => console.log(error));
        // Генерация случайных направлений для текста
        const randomX = Math.random() * 400 - 200; // Случайное смещение по X
        const randomY = Math.random() * -400 - 100; // Случайное смещение по Y (вверх)
        const randomDuration = Math.random() * 1 + 0.5; // Случайная длительность анимации

        // Генерация стиля для вылетающего текста
        const newFlyText = {
            text: "ХЫТЬ",
            x: randomX,
            y: randomY,
            duration: randomDuration,
        };

        setFlyText((prev) => [...prev, newFlyText]);
    };

    // Функция для удаления текста после завершения анимации
    const handleAnimationEnd = (index) => {
        setFlyText((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="App">
            <div className="container1">
                <h1>WHEELCHAIR COMBAT</h1>
                <div className="counter">
                    <img src={huhcoin} alt="coin"/>
                    <p>{clickCount}</p>
                </div>
                <button onClick={handleClick}>
                    <img src={whils} alt="wheelchair"/>
                    {flyText.map((item, index) => (
                        <div
                            key={index}
                            className="fly-text"
                            style={{
                                left: '50%',
                                top: '50%',
                                transform: `translate(-50%, -50%)`,
                                animationDuration: `${item.duration}s`,
                                '--x': `${item.x}px`,
                                '--y': `${item.y}px`,
                            }}
                            onAnimationEnd={() => handleAnimationEnd(index)} // Удаляем текст после анимации
                        >
                            {item.text}
                        </div>
                    ))}
                </button>
            </div>
        </div>
    );
}

export default App;
