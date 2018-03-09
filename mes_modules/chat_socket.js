
const util = require('util');
let socketio = require('socket.io')

module.exports.listen = function(server){
    let io = socketio.listen(server)

    // ------------------------------ Traitement du socket
    let objUtilisateur = {}
    io.on('connection', function(socket){
        console.log(socket.id)
        
        socket.on('setUser', function(data){
            console.log(util.inspect(data));

            socket.emit('NouvelUtilisateur', data);
        })
    })
    return io
}
