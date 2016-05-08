var map;
var infowindow;
var placesAdded;
var raceId;
var Mapper = function() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 51.723988, lng: 5.261352},
		zoom: 13,
		styles: [{ featureType: "poi", stylers: [ { visibility: "off" } ] }]
	});
	infowindow = new google.maps.InfoWindow();
	placesAdded = placesAdded || [];
	raceId = raceId || undefined;
	var service = new google.maps.places.PlacesService(map)
	
	if(placesAdded.length > 0) {
		var getNextPlaceDetails = function(index) {
			if(index >= placesAdded.length) {
				return;
			}
			service.getDetails({ placeId: placesAdded[index] }, function(place, status) {
				if (status === google.maps.places.PlacesServiceStatus.OK && place) {
					waypointHandler(null, place.place_id, place.name, { getPosition: function() {
						return place.geometry.location;
					} });
					getNextPlaceDetails(index + 1);
				}
			});
		}
		getNextPlaceDetails(0);
	}
	
	var createRaceButton = $('#createRaceParagraph');
	if(createRaceButton.length > 0) {
		$.ajax({ method: 'GET', url: '/profile?format=json' }).done(function() {
			createRaceButton.show();
		});
	}
	
	var updateExistingRaceSubmit = function(form) {
		
		var nameInput = form.find('#race_name');
		var raceData = { name: nameInput.val().trim() };
		
		var placeIds = placesAdded;
		$.ajax({
			method: 'DELETE',
			url: '/race/' + raceId + '/waypoints?format=json'
		}).done(function() {
			var nextRequest = function(index) {
				var returnable = function() {
					window.location.reload(true);
				};
				if(index < placeIds.length) {
					returnable = function() {
						$.ajax({
							url: '/race/' + raceId + '/waypoints?format=json',
							method: 'POST',
							data: { pid: placeIds[index] }
						}).done(nextRequest(index + 1));
					}
				}
				return returnable;
			}
			var currentRequest = $.ajax({ method: 'PUT', url: '/race/' + raceId + '?format=json', data: raceData });
			currentRequest.done(nextRequest(0));
		});
	}
	
	var createNewRaceSubmit = function(form) {		
		var nameInput = form.find('#race_name');
		var raceData = { name: nameInput.val() };
		
		var placeIds = placesAdded;
		
		$.post('/race?format=json', raceData, function(result, status, xhr) {
			var nextRequest = function(index) {
				var returnable = function() {
					window.location.href = '/race/' + result._id;
				};
				if(index < placeIds.length) {
					returnable = function() {
						$.ajax({
							url: '/race/' + result._id + '/waypoints?format=json',
							method: 'POST',
							data: { pid: placeIds[index] }
						}).done(nextRequest(index + 1));
					}
				}
				return returnable;
			}
			var currentRequest = $.ajax({
				url: '/race/' + result._id + '/waypoints?format=json=',
				method: 'POST',
				data: { pid: placeIds[0] }
			});
			currentRequest.done(nextRequest(1));
		});
	}
	
	var form = $('#raceForm');
	form.on('submit', function(evt) {
		if(raceId) {
			updateExistingRaceSubmit(form);
		}
		else {
			createNewRaceSubmit(form);
		}
		evt.preventDefault();
	});
	
	// Create the search box and link it to the UI element.
	var input = document.getElementById('pac-input');
	var searchBox = new google.maps.places.SearchBox(input, {
		types: ['bar', 'cafe', 'restaurant']
	});
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

	// Bias the SearchBox results towards current map's viewport.
	map.addListener('bounds_changed', function() {
		searchBox.setBounds(map.getBounds());
	});
	
	var createWaypointHTML = function(name, placeId) {
		return '' +
			'<div class="panel panel-default">' +
				'<div class="panel-body">' +
					'<div class="btn-group" role="group" style="width: 100%;">' +
						'<button type="button" class="btn btn-default center" style="width: 80%; overflow: hidden"  data-toggle="tooltip" data-placement="bottom" title="' + name + '">' + name + '</button>' +
						'<button type="button" class="btn btn-danger remove" ><span aria-hidden="true">&times;</span></button>' +
					'</div>' +
				'</div>' +
				// '<input type="hidden" name="waypoints.Index" value="' + name + '">' +
				// '<input type="hidden" name="waypoints[' + name + ']" value="' + placeId + '">' +
			'</div>';
	}
	var waypointHandler = function(evt, placeId, name, marker) {
		var container = $('#waypointContainer');
		var waypointNode = $(createWaypointHTML(name, placeId));
		var waypointMarker = new google.maps.Marker({
			position: marker.getPosition(),
			label: name,
			map: map
		});
		waypointNode.find('.center').on('click', function() {
			map.setCenter(waypointMarker.getPosition());
		});
		waypointNode.find('.remove').on('click', function() {
			waypointMarker.setMap(null);
			waypointNode.remove();
			var i = placesAdded.indexOf(placeId);
			if (i > -1) {
				placesAdded.splice(i, 1);
			}
		});
		google.maps.event.addListener(waypointMarker, 'click', function() {
			infowindow.setContent('<div><strong>' + name + '</strong></div>');
			infowindow.open(map, this);
		});
		container.append(waypointNode);
	}
	
	var markers = [];
	// Listen for the event fired when the user selects a prediction and retrieve
	// more details for that place.
	searchBox.addListener('places_changed', function() {
		var places = searchBox.getPlaces();

		if (places.length == 0) {
			return;
		}

		// Clear out the old markers.
		markers.forEach(function(marker) {
			marker.setMap(null);
		});
		markers = [];
		
		// methods
		var createIcon = function(place) {
			return {
				url: place.icon,
				size: new google.maps.Size(71, 71),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(17, 34),
				scaledSize: new google.maps.Size(25, 25)
			}; 
		}
		var createMarker = function(map, icon, place) {
			return new google.maps.Marker({
				map: map,
				icon: icon,
				title: place.name,
				position: place.geometry.location
			});
		}
		var createInfoWindowHTML = function(place, placeDetails) {
			var htmlString = ''	+
				'<div>' +
					'<strong>Er kon geen informatie worden opgehaald...</strong><br />' +
				'</div>';
			if(placeDetails && placeDetails.place_id) {
				var openingString = 'Openingstijden:<br />';
				if(placeDetails.opening_hours && placeDetails.opening_hours.weekday_text) {
					for(weekday of placeDetails.opening_hours.weekday_text) {
						openingString += ' - ' + weekday + '<br />';
					}
				}
				else {
					openingString += ' - niet beschikbaar<br />';
				}
				htmlString = '' +
					'<div class="clearfix">' + 
						'<strong>' + placeDetails.name + ' || ' + placeDetails.place_id + '</strong><br />' +
						'Adress: ' + placeDetails.formatted_address + '<br />' +
						'Beoordeling: ' + (placeDetails.rating ? placeDetails.rating : 'geen beoordeling beschikbaar') + '<br />' +
						'Phonenumber: ' + placeDetails.formatted_phone_number + ' / ' + placeDetails.international_phone_number + '<br />' +
						openingString +
						'<button type="button" class="btn btn-primary pull-right">Toevoegen</button><br />' +
					'</div>';
			}
			else if(place && place.place_id) {
				htmlString = '' +
					'<div class="clearfix">' + 
						'<strong>' + place.name + ' || ' + place.place_id + '</strong><br />' +
						'Adress: ' + place.formatted_address + '<br />' +
						'Beoordeling: ' + (place.rating ? place.rating : 'geen beoordeling beschikbaar') + '<br />' +
						'<button type="button" class="btn btn-primary pull-right">Toevoegen</button><br />' +
					'</div>';
			}
			return htmlString;
		}

		// For each place, get the icon, name and location.
		var bounds = new google.maps.LatLngBounds();
		places.forEach(function(place) {
			var icon = createIcon(place);

			// Create a marker for each place.
			var marker = createMarker(map, icon, place);
			
			service.getDetails({ placeId: place.place_id }, function(placeDetails, status) {
				if (status === google.maps.places.PlacesServiceStatus.OK && placeDetails) {
					google.maps.event.addListener(marker, 'click', function() {
						var htmlString = createInfoWindowHTML(place, placeDetails);
						var div = $(htmlString);
						div.find('button').on('click', function(evt) {
							if(!(placesAdded.indexOf(place.place_id) > -1)) {
								// place is not added
								placesAdded.push(place.place_id);
								waypointHandler(evt, place.place_id, place.name, marker);
							}
							else {
								alert('Plek is al toegevoegd.');
							}
						});
						infowindow.setContent(div[0]);
						infowindow.open(map, this);
					});
				}
				else {
					google.maps.event.addListener(marker, 'click', function() {
						var htmlString = createInfoWindowHTML(place);
						var div = $(htmlString);
						div.find('button').on('click', function(evt) {
							if(!(placesAdded.indexOf(place.place_id) > -1)) {
								// place is not added
								placesAdded.push(place.place_id);
								waypointHandler(evt, place.place_id, place.name, marker);
							}
							else {
								alert('Plek is al toegevoegd.');
							}
						});
						infowindow.setContent(div[0]);
						infowindow.open(map, this);
					});
				}
			});
			
			markers.push(marker);

			if (place.geometry.viewport) {
				// Only geocodes have viewport.
				bounds.union(place.geometry.viewport);
			} else {
				bounds.extend(place.geometry.location);
			}
		});
		map.fitBounds(bounds);
	});
}