const Profession = require('../models/professions');

module.exports = {
    createProfession: async(req, res, next)=>{
        try{
            const profession = await Profession.create(req.body);
            res.status(201).json({
                status: 'success',
                message: 'profession created',
                data: {profession}
            })
        } catch(err){
            next(err)
        }
    },

    getProfessions: async(req, res, next)=>{
        const professions = await Profession.find({});
        res.status(200).json({
            status: 'success',
            data: {professions}
        })
    },

    getProfession: async(req, res, next)=>{
        const profession = await Profession.findById(req.params.profession_id);
        res.status(200).json({
            status: 'success',
            data: {profession}
        })
    }
}