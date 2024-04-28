const { prisma } = require('../prisma/prisma-client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Функция для входа пользователя
const login = async (req, res, next) => {
    const { email, password } = req.body;
    

    // Проверка наличия email и password в запросе
    if ((!email || !password)) {
        return res.status(400).json({ message: 'Пожалуйста, заполните все поля' });
    }

    // Поиск пользователя по email в базе данных
    const user = await prisma.user.findFirst({
        where: { email },
    });

    // Проверка совпадения пароля
    const isPasswordValid = user && (await bcrypt.compare(password.toString(), user.password));

    // Если пароль неверный, отправляем сообщение об ошибке
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Вы ввели неправильный логин или пароль' });
    }

    const key = process.env.JWT_SECRET

    // Если email и password валидны, отправляем информацию о пользователе
    if (password && isPasswordValid && key){
        return res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        city: user.city,
        token: jwt.sign({ id: user.id }, key, { expiresIn: '30h' })
    })}
};

// Функция для регистрации нового пользователя
const register = async (req, res, next) => {
    const { name, phone, password, city, role, email } = req.body;

    // Проверка наличия всех обязательных полей в запросе
    if (!name || !phone || !password || !city || !role) {
        return res.status(400).json({ message: 'Заполните все поля' });
    }

    // Проверка наличия пользователя с таким email или phone в базе данных
    const registeredUser = await prisma.user.findFirst({
        where: { email, phone },
    });

    // Если пользователь с таким email уже существует, отправляем сообщение об ошибке
    if (registeredUser && registeredUser.email) {
        return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }
    
    // Если пользователь с таким phone уже существует, отправляем сообщение об ошибке
    if (registeredUser && registeredUser.phone) {
        return res.status(400).json({ message: 'Пользователь с таким phone уже существует' });
    }

    try {
        // Хеширование пароля
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password.toString(), salt);

        // Создание нового пользователя в базе данных
        const user = await prisma.user.create({
            data: {
                email,
                name,
                phone,
                city,
                role,
                password: hashedPassword,
            },
        });
 
        const key = process.env.JWT_SECRET;

        // Генерация JWT токена
        if (user && key) {
            return res.status(201).json({
                email,
                name,
                phone,
                city,
                role,
                id: user.id,
                token: jwt.sign({ id: user.id }, key, { expiresIn: '30h' }),
            });
        } else {
            return res.status(400).json({ message: 'Не удалось создать пользователя' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Ошибка при регистрации' });
    }
};

// Функция для получения текущего пользователя (просто заглушка)
const current = async (req, res, next) => {
    res.status(200).json(req.user)
};

// Экспорт функций
module.exports = {
    login,
    register,
    current,
};
