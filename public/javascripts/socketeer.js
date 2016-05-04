var raceID = raceID || undefined;
if(raceID) {
	var socket = io.connect('http://localhost:3000/Race');
	socket.emit('create', raceID);
	socket.emit('toServer', { message: 'I am connected!', user: 'client' });
	socket.on('toClient', function (data) {
		console.log(data);
	});
}