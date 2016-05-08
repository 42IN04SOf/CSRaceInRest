var raceID = raceID || undefined;
if(raceID) {
	var socket = io.connect('http://rrfm.herokuapp.com/Race');
	socket.emit('create', raceID);
	socket.emit('toServer', { message: 'I am connected!', user: 'client' });
	socket.on('toClient', function (data) {
		console.log(data);
	});
}