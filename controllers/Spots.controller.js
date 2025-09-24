const User = require('../models/User');
const Spots = require('../models/Spots');

const store = async (req,res) =>{
    const { company, price, techs } = req.body
    const { user_id } = req.headers;

    if (!req.file)
        return res.status(400).json({error: 'Arquivo não encontrado'})

    const { filename } = req.file;

    console.log(req.file);

    const usuario = await User.findById(user_id);
    if(!usuario) return res.status(400).json({error:'Usuáro não existe!!!'})

    const spot = await Spots.create({
        thumbnail: filename,
        user: user_id,
        company,
        price,
        techs: techs.split(',').map(tech=> tech.trim()),
    })

    return res.json(spot);
}

const index = async (req, res) =>{
    const { tech } = req.query
    const spots = await Spots.find({ techs: tech})
    

    return res.json(spots)
}

module.exports = { store, index }

// Index - para consultar varios .get
// store - para cadastrar .put
// show - para consultar .get
// remove - para deletar .delete
// update - para alterar .