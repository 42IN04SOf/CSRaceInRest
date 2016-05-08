var raceId;
$(document).ready(function() {
	raceId = raceId || null;
	if(!raceId) {
		throw new Error('No race id found');
	}
	
	var container = $('#resultPanel');
	var htmlString = function(race, participants, waypoints) {
		var owner = race.ownerID.local
			? race.ownerID.local.email
			: (race.ownerID.google
				? race.ownerID.google.name
				: 'Unavailable');
		return '' +
			'<div class="panel panel-primary">' +
				'<div class="panel-heading">' +
					'<h3 class="panel-title">Results for: ' + race.name + '</h3>' +
				'</div>' +
				'<div class="panel-body">' +
					'<strong>Hosted by:</strong> ' + owner + '<br />' +
					'<strong>Started at:</strong> ' + new Date(race.dateStart) + '<br />' +
					'<strong>Finished at:</strong> ' + new Date(race.dateStop) + '<br />' +
				'</div>' +
				'<table class="table table-sm">' +
					'<thead>' +
						'<caption><h3>Participants</h3></caption>' +
						'<tr>' +
							'<td><strong>Name</strong></td>' +
							'<td><strong>Waypoints completed</strong></td>' +
						'</tr>' +
					'</thead>' +
					'<tbody id="participantsTable">' +
					'</tbody>' +
				'</table>' +
				'<table class="table table-sm">' +
					'<thead>' +
						'<caption><h3>Waypoints</h3></caption>' +
						'<tr>' +
							'<td><strong>Name</strong></td>' +
							'<td><strong>Address</strong></td>' +
						'</tr>' +
					'</thead>' +
					'<tbody id="waypointsTable">' +
					'</tbody>' +
				'</table>' +
			'</div>';
	}
	var rowHtml = function(key, value) {
		return '' +
			'<tr>' +
				'<td>' + key + '</td>' +
				'<td>' + value + '</td>' +
			'</tr>';
	}
	var racePromise = $.ajax({
		method: 'GET',
		url: '/race/' + raceId + '?format=json'
	});
	var participantsPromise = $.ajax({
		method: 'GET',
		url: '/race/' + raceId + '/participants?format=json'
	});
	var waypointsPromise = $.ajax({
		method: 'GET',
		url: '/race/' + raceId + '/waypoints?format=json'
	});
	
	racePromise.done(function(race) {
		participantsPromise.done(function(participants) {
			waypointsPromise.done(function(waypoints) {
				if(!race.dateStop) {
					return;
				}
				var panel = $(htmlString(race, participants, waypoints));
				var partTable = panel.find('#participantsTable');
				participants.result.reverse().forEach(function(participant) {
					var name = (participant.userID.google ? participant.userID.google.name : null) 
						|| (participant.userID.local ? participant.userID.local.email : null)
						|| 'Unavailable'; 
					partTable.append(rowHtml(name, participant.waypointsCompleted.length));
				});
				
				var wayTable = panel.find('#waypointsTable');
				waypoints.result.reverse().forEach(function(waypoint) {
					wayTable.append(rowHtml(waypoint.place.name, waypoint.place.vicinity));
				});
				
				container.append(panel);
				$('#transitioner').remove();
			});
		});
	});
});