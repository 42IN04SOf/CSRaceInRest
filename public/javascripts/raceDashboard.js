var raceId;
$(document).ready(function() {
	raceId = raceId || undefined;
	if(!raceId) {
		throw new Error('no race id found');
	}
	
	var startButton = $('#startRace');
	var stopButton = $('#stopRace');
	var editButton = $('#editRace');
	var initializeRaceControls = function() {
		var waypointsPromise = $.ajax({
			method: 'GET',
			url: '/race/' + raceId + '/waypoints?format=json'
		});
		var racePromise = $.ajax({
			method: 'GET',
			url: '/race/' + raceId + '?format=json'
		});
		racePromise.done(function(race) {
			waypointsPromise.done(function(waypoints) {
				console.log(race, waypoints);
				if(waypoints.count <= 0 || race.dateStart) {
					startButton.prop('disabled', true);
				}
				if(!race.dateStart || race.dateStop) {
					stopButton.prop('disabled', true);
				}
				if(race.dateStart || race.dateStop) {
					editButton.prop('disabled', true);
				}
			});
		});
	}
	
	startButton.on('click', function() {
		$.ajax({
			method: 'POST',
			url: '/race/' + raceId + '/state?format=json'
		}).done(function() {
			window.location.reload(true);
		});
	});	
	
	stopButton.on('click', function() {
		$.ajax({
			method: 'DELETE',
			url: '/race/' + raceId + '/state?format=json'
		}).done(function() {
			window.location.reload(true);
		});
	});
	initializeRaceControls();
});