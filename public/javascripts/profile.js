var userId;
$(document).ready(function() {
	userId = userId || undefined;
	if(!userId) {
		throw new Error('No user found');
	}
	
	var ownedRaces = $('#ownedRacesContainer');
	var participatingRaces = $('#participatingRacesContainer');
	
	var raceBoxHtml = function(race, url) {
		console.log(race);
		return '' +
			'<div class="col-lg-12">' +
				'<div class="panel panel-default">' +                    
					'<div class="panel-heading">' +
						'<h3 class="panel-title">' + (race.name || '') + '</h3>' +
					'</div>' +
					'<div class="panel-body clearfix">' +
						'<span><strong>Date created: </strong>' + (race.dateCreate || '') + '</span><br />' +
						'<span>' +
							'<strong>Date started: </strong>' +
							(race.dateStart || '') +
						'</span><br />' +
						'<span>' +
							'<strong>Date stopped: </strong>' +
							(race.dateStop || '') +
						'</span><br />' +
						'<span>' +
							'<strong>Owner</strong>' +
							(race.ownerID.local.email || race.ownedID.google.name || '') +
						'</span><br />' +
						'<a class="btn btn-primary pull-right" href="' + url + '">Details</a>' +
					'</div>' +
				'</div>' +
			'</div>';
	}
	
	var ownedPromise = $.ajax({
		method: 'GET',
		url: '/user/' + userId + '/owningraces?format=json'
	});
	var participatingPromise = $.ajax({
		method: 'GET',
		url: '/user/' + userId + '/participatingraces?format=json'
	});
	
	ownedPromise.done(function(owned) {
		if(owned.count == 0) {
			return;
		}
		var i = 0;
		for(race of owned.result) {
			var htmlString = raceBoxHtml(race, '/user/' + userId + '/owningraces/' + race._id);
			var raceBox = $(htmlString);
			ownedRaces.append(raceBox);
			i++;
		}
	});
	participatingPromise.done(function(participating) {
		console.log(participating);
		if(participating.count == 0) {
			return;
		}
		for(race of participating.result) {
			var htmlString = raceBoxHtml(race, '/race/' + race._id);
			var raceBox = $(htmlString);
			participatingRaces.append(raceBox);
		}
	});
});