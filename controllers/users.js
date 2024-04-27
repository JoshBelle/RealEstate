const { prisma } = require("../prisma/prisma-client");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const login = async (req, res, next) => {
    const {email, password} = req.body;
    if (!email, !password) {
        return res.status(400).json({message: 'Пожалуйста заполните все поля'})
    }

    const user = await prisma.user.findFirst({
        where:{
            email,
        }
    })

    const isPasswordValid = user && (await bcrypt.compare(password, user.password))

    if(!isPasswordValid){
        res.status(401).json({message: 'Вы ввели неправильный пароль'})
    }

    if (email && password) {
        res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            city: user.city
        })
    } else {
        return res.status(400).json({message: 'Неправильный логин или пароль'})
    }

    const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET, { expiresIn: '1h'})
    
}


const register = async (req, res, next) => {
    const {name, phone, password, city, role} = req.body
    const hashedPassword = await bcrypt(password, 20)

    try {
        await prisma.user.create({
            name,
            phone,
            city,
            role,
            password: hashedPassword
        })
        res.status(201).json({message: 'Регистрация прошла успешно'})
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Ошибка при регистрации'})
    }
    
}
const current = async (req, res, next) => {
    res.send('current')
}

module.exports = {
    login,
    register,
    current
}