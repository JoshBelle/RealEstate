const jwt = require('jsonwebtoken');
const prisma = require('../prisma/prisma-client');

// Middleware для аутентификации
const auth = async (req, res, next) => {
    try {
        // Извлекаем токен из заголовка запроса
        let token = req.headers.authorization?.split(' ')[1];
        
        // Проверяем валидность токена и декодируем его
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Ищем пользователя в базе данных по его идентификатору из токена
        const user = await prisma.user.findUnique({
            where: {
                id: decoded.id
            }
        });

        // Если пользователь найден, добавляем его данные в объект запроса
        req.user = user;
        
        // Определяем роль пользователя
        req.role = user.role; 

        // Переходим к следующему обработчику запроса
        next();
    } catch (error) {
        // В случае ошибки отправляем ответ с кодом 401 (Не авторизован)
        res.status(401).json({ message: 'Не авторизован' });
    }
}

// Экспортируем middleware для использования в других частях приложения
module.exports = { auth };
