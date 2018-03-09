
const util = require('util');
let socketio = require('socket.io')

module.exports.listen = function(server){
    let io = socketio.listen(server)

    // ------------------------------ Traitement du socket
    let objUtilisateur = {}
    io.on('connection', function(socket){
        console.log(socket.id)
        
        socket.on('ajouterUtilisateur', function(data){
           objUtilisateur[socket.io] = data.user;
        //    concole.log(objUtilisateur);
           io.emit("NouvelUtilisateur", data);
        })
        socket.on("ajouterMessage", function(data, couleur) {
            console.log(data.message);
            socket.broadcast.emit("nouveauMessage", data, "#DCDCDC");
            socket.emit("nouveauMessage", data, "#00BFFF");
        })
        socket.on("deconnection", function(data) {
            console.log(data.id);
            let message = data.nom + " c'est déconnecté";
            data.message = message;
            console.log(objUtilisateur[socket.io]);

            data.id = socket.id;

            io.emit("deconnection", data);
            socket.disconnect();
            delete objUtilisateur[socket.id];
        })
        
    })
    return io
}
