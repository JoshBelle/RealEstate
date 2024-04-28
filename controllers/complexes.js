const prisma = require('../prisma/prisma-client.js');

// Get all complexes
const getAll = async (req, res) => {
    try {
        const complexes = await prisma.complexes.findMany({
        })
        res.status(200).json(complexes)
    } catch (error) {
        res.status(500).json({message: 'Не удалось получить комплексы'})
    }
};

// Add new complex
const addComplex = async (req, res) => {
    try {
        const {name, address, city, description, image} = req.body

        if(!name || !address || !city || !description ) {
            return res.status(400).json({message: 'Все поля обязательны для заполнения'})
        }
        if (!image) {
            return res.status(500).json({message: 'Загрузите изображение'})
        }

        const newComplex = await prisma.complexes
    } catch (error) {
        
    }
}


module.exports = { getAll }