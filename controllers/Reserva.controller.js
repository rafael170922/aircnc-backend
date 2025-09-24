const Booking = require('../models/Booking');

const store = async (req,res) =>{
    const { user_id } = req.headers;
    const { spot_id } = req.params;
    const { date } = req.body;

    const booking = await Booking.create({
        user: user_id,
        spot: spot_id,
        date,
    })

    await booking.populate(['spot', 'user'])

    console.log('Reserva criada para o spot ', booking.spot.company);
    console.log('Dono do spot (booking.spot.user) ', booking.spot.user);
    console.log('Socket ID do dono: ', req.connectedUsers[booking.spot.user]);

    // pesquisando o usuario dono do spot que está sendo efetuado a reserva
    const ownerSockets = req.connectedUsers[booking.spot.user]

    if (ownerSockets && ownerSockets.length > 0) {
        ownerSockets.forEach(socketId => {
            req.io.to(socketId).emit('booking_request', booking)
        })
    }


    return res.json(booking)
}

const storeApproval = async(req,res) =>{
    const { booking_id } = req.params;
    const booking = await Booking.findById(booking_id).populate('spot')

    console.log(booking);

    await Booking.updateOne(
        {_id: booking_id},
        { $set:{ approved: true} }
    )

    return res.json(booking);
}

const storeRejection = async(req,res) =>{
    const { booking_id } = req.params;
    const booking = await Booking.findById(booking_id).populate('spot')

    console.log(booking);

    await Booking.updateOne(
        {_id: booking_id},
        { $set:{ approved: false} }
    )

    return res.json(booking);    
}

module.exports = { store, storeApproval, storeRejection }