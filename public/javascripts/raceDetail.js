var map;
var infowindow;
var raceId;

var docsReady = false;
var googleReady = false;

function initUsingGoogle() {
	googleReady = true;
	if(docsReady && googleReady) {
		start();
	}
}

function initUsingDocs() {
	docsReady = true;
	if(docsReady && googleReady) {
		start();
	}
}

function start() {
	raceId = raceId || undefined;
	map = new google.maps.Map(document.getElementById('map'), {
		center: { lat: 51.723988, lng: 5.261352 }, // start @denbosch
		zoom: 13, // some arbitrary zoom-level
		styles: [{ featureType: "poi", stylers: [ { visibility: "off" } ] }] // remove points of interest
	});
	infowindow = new google.maps.InfoWindow(); // single infowindow
	var detailContainer = $('#detailContainer');
	var controlContainer = $('#controlContainer');
	var raceBox;
	var logBox;
	var controlBox;
	
	if(!raceId) {
		throw new Error('no race id');
	}
	
	// retrieve data
	var profilePromise = $.ajax({
		method: 'GET',
		url: '/profile?format=json'
	});
	var participantPromise = $.ajax({
		method: 'GET',
		url: '/race/' + raceId + '/participants?format=json'
	});
	var racePromise = $.ajax({
		method: 'GET',
		url: '/race/' + raceId + '?format=json'
	});
	var waypointPromise = $.ajax({
		method: 'GET',
		url: '/race/' + raceId + '/waypoints?format=json'
	});
	
	var buttons = []
	var showNext = function(ii) {
		if(ii < buttons.length) {
			buttons[ii].show();
		}
	}	
	
	profilePromise.done(function(profile) {
		console.log(profile);
		participantPromise.done(function(participants) {
			var userParticipant = false;
			console.log(profile, participants);
			participants.result.forEach(function(participant) {
				if(participant.userID._id == profile._id) {
					userParticipant = participant;
				}
			});
			if(userParticipant) {
				// todo: init waypoint (if started) controls
				var htmlString = '' +
					'<div class="panel panel-primary">' +
						'<div class="panel-heading">' +
							'<h3 class="panel-title" id="controlTitle">Controls</h3>' +
						'</div>' +
						'<table class="table">' +
							'<thead>' +
								'<tr>' +
									'<td>#</td>' +
									'<td>Name</td>' +
									'<td>Action</td>' +
								'</tr>' +
							'</thead>' +
							'<tbody id="controlTable">' +
							'</tbody>' +
						'</table>' +
					'</div>';
				var rowHtml = '' +
					'<tr>' +
						'<td class="waypointIndex">1</td>' +
						'<td class="waypointName">De Café</td>' +
						'<td><button class="btn btn-default btn-lg waypointAction" type="button">Completed</button></td>' +
					'</tr>';
				controlBox = $(htmlString);
				waypointPromise.done(function(waypoints) {
					
					waypoints.result.forEach(function(waypoint, index) {
						var rowBox = $(rowHtml);
						rowBox.find('.waypointIndex').html(index);
						rowBox.find('.waypointName').html(waypoint.place.name);
						
						var indiceWaypoint = false;
						userParticipant.waypointsCompleted.forEach(function(completedWaypoint) {
							if(waypoint._id == completedWaypoint.waypointID) {
								indiceWaypoint = completedWaypoint; 
							}
						});
												
						var actionable = indiceWaypoint
							? 'Completed'
							: 'Complete';
						
						var button = rowBox.find('.waypointAction')
						button.hide();
						button.html(actionable);
						buttons.push(button);
						if(indiceWaypoint) { // waypoint completed
							button.prop('disabled', true);
							button.show();
						}
						button.one('click', function() {
							showNext(index + 1);
							$.ajax({
								method: 'PUT',
								url: '/race/' + raceId + '/participants/' + userParticipant._id + '/waypoints?format=json',
								data: { wid: waypoint._id }
							}).done(function() {
								button.html('Completed');
								button.prop('disabled', true);
							});
						});
						controlBox.find('#controlTable').append(rowBox);
					});
					racePromise.done(function(race) {
						if(race.dateStart && !race.dateStop) {
							// showNext(0);
							var initial = true;
							buttons.forEach(function(button) {
								if(button.html() === 'Completed') {
									button.show();
								}
								else if(initial) {
									initial = false;
									button.show();
								}
								else {
									button.hide();
								}
							});
						}
						else {
							if(buttons.length > 0) {
								buttons[0].prop('disabled', true);
							}
							showNext(0);
						}
					});
				});
				
				// todo: controlBox controls
				
				controlContainer.append(controlBox);
			}
			else { // views as guest
				// todo: init join/leave controls
				var htmlString = '' +
					'<div class="panel panel-primary">' +
						'<div class="panel-heading">' +
							'<h3 class="panel-title" id="controlTitle">Controls</h3>' +
						'</div>' +
						'<div class="panel-body clearfix text-center">' +
							'<button class="btn btn-primary btn-lg" type="button" id="controlJoin">Join</button>' +
						'</div>' +
					'</div>';
				controlBox = $(htmlString);
				
				var joinButton = controlBox.find('#controlJoin');
				racePromise.done(function(race) {
					if(race.dateStart) {
						joinButton.prop('disabled', true);
					}
				});
				joinButton.one('click', function() {
					$.ajax({
						method: 'POST',
						url: '/race/' + raceId + '/participants?format=json',
						data: {}
					}).done(function() {
						window.location.reload(true);
					});
				})
				
				// todo: controlBox controls
				
				controlContainer.append(controlBox);
			}
		});
	});
	racePromise.done(function(race) {
		var htmlString = '' +
			'<div class="panel panel-default">' +
				'<div class="panel-heading">' +
					'<h3 class="panel-title" id="raceName"></h3>' +
				'</div>' +
				'<div class="panel-body clearfix">' +
					'<span>' +
						'<strong>Created: </strong>' +
						'<span id="raceCreated"></span>' +
					'</span><br />' +
					'<span>' +
						'<strong>Status: </strong>' +
						'<span id="raceStatus"></span>' +
					'</span><br />' +
					'<span>' +
						'<strong>Owner: </strong>' +
						'<span id="raceOwner"></span>' +
					'</span><br />' +
				'</div>' +
			'</div>';
		racebox = $(htmlString);
		racebox.find('#raceName').html(race.name);
		racebox.find('#raceCreated').html(new Date(race.dateCreate));
		racebox.find('#raceOwner').html(race.ownerID.local.email || race.ownerID.google.name);
		var status = race.dateStart
			? race.dateStop
				? 'finished' // both dateStart and dateStop
				: 'in progress' // only dateStart
			: 'pending'; // no dateStart
		racebox.find('#raceStatus').html(status);
		detailContainer.empty().append(racebox);
		
		var htmlString2 = '' +
			'<div class="panel panel-default">' +
				'<div class="panel-heading">' +
					'<h3 class="panel-title" id="logTitle">Log</h3>' +
				'</div>' +
				'<div class="panel-body clearfix" id="logBody" style="overflow-y: auto; max-height: 300px;">' +
				'</div>' +
			'</div>';
		logBox = $(htmlString2);
		detailContainer.append(logBox);
	});
	waypointPromise.done(function(waypoints) {
		if(waypoints.count <= 0) {
			return
		}
		waypoints.result.reverse().forEach(function(waypoint, i) {
			var marker = new google.maps.Marker({
				map: map,
				label: (i + 1) + '',
				title: waypoint.place.name,
				position: waypoint.place.geometry.location
			});
			google.maps.event.addListener(marker, 'click', function() {
				map.setCenter(this.getPosition());
				infowindow.setContent('<div><strong>' + waypoint.place.name + '</strong><br /><p>' + waypoint.place.vicinity + '</p></div>');
				infowindow.open(map, this);
			});
			if(i == 0) {
				map.setCenter(marker.getPosition());
				map.setZoom(15);
			}
		});
	});
	
	// socket start
	var socket = io.connect('http://rrfm.herokuapp.com/Race');
	socket.emit('create', raceId);
	socket.emit('toServer', { message: 'I am connected!', user: 'client' });
	socket.on('toClient', function (data) {
		// console.log(data);
		// format
		// - user : [server]
		// - type : [room, global, private]
		// - message : string
		// - code : [start, stop, waypointCleared]
		if(logBox) {
			var prepender = (logBox.find('#logBody').html() ? (logBox.find('#logBody').html() + '<br />') : '');
			var message = '[' + data.type + '] ' + data.user + ': ' + data.message;
			logBox.find('#logBody').html(prepender + message);
			logBox.find('#logBody').scrollTop(function() {
				return this.scrollHeight;
			});
		}
		if(raceBox) {
			switch(data.code) {
				case 'start':
					raceBox.find('#raceStatus').html('Started');
					break;
				case 'stop':
					raceBox.find('#raceStatus').html('Finished');
					break;
				default:
					break;
			}
		}
		if(data.code == 'start' && buttons.length > 0) {
			buttons[0].prop('disabled', false);
			buttons[0].show();
		}
		if(data.code == 'stop' && buttons.length > 0) {
			for(booton of buttons) {
				booton.prop('disabled', true);
			}
		}
	});
}

$(document).ready(initUsingDocs);