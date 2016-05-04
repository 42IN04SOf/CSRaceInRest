// Use [Function emitGlobal] to safely emit messages to clients connected using sockets.
// Use [Function setSocket] to set the socket that will be used.
module.exports = (function() {
	var globalSocket = undefined;	
	return {
		emitGlobal: function(payload) {
			if(globalSocket) {
				globalSocket.emit('toClient', payload);
				return true;
			}
		},
		emitToRace: function(raceId, payload) {
			if(globalSocket) {
				globalSocket.to(raceId).emit('toClient', payload);
				return true;
			}
		},
		setGlobalSocket: function(_socket) {
			globalSocket = _socket;
		}
	}
})();