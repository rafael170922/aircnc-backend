const Spots = require('../models/Spots');

const index = async (req, res) => {
    const { user_id } = req.headers;

    // console.log(user_id)

    const spots = await Spots.find({ user: user_id})

    return res.json(spots);
}

module.exports = { index }