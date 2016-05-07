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
		for(placeId of placesAdded) {
			service.getDetails({ placeId: placeId }, function(place, status) {
				if (status === google.maps.places.PlacesServiceStatus.OK && place) {
					waypointHandler(null, place.place_id, place.name, { getPosition: function() {
						return place.geometry.location;
					} });
				}
			});
		}
	}
	
	var updateExistingRaceSubmit = function(form) {
		var muhToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NzI3ZDNiYzlmM2UyZWQ4MzkwZDg2MGEiLCJfX3YiOjAsImxvY2FsIjp7InBhc3N3b3JkIjoiJDJhJDA4JHdmRlpoN3ZIbUhlRWE2VW54ZnowV2UyazNLRzFTSWR5c3hKbVFWQ1lPUFBrUFJHVzIvZkZXIiwiZW1haWwiOiJmc2thcnNvZEBhdmFucy5ubCIsInRva2VuIjoiZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKSVV6STFOaUo5LmV5SmZhV1FpT2lJMU56STNaRE5pWXpsbU0yVXlaV1E0TXprd1pEZzJNR0VpTENKZlgzWWlPakFzSW14dlkyRnNJanA3SW5CaGMzTjNiM0prSWpvaUpESmhKREE0SkhkbVJscG9OM1pJYlVobFJXRTJWVzU0Wm5vd1YyVXlhek5MUnpGVFNXUjVjM2hLYlZGV1ExbFBVRkJyVUZKSFZ6SXZaa1pYSWl3aVpXMWhhV3dpT2lKbWMydGhjbk52WkVCaGRtRnVjeTV1YkNJc0luUnZhMlZ1SWpvaVpYbEtNR1ZZUVdsUGFVcExWakZSYVV4RFNtaGlSMk5wVDJsS1NWVjZTVEZPYVVvNUxtVjVTbVpoVjFGcFQybEpNVTU2U1ROYVJFNXBXWHBzYlUweVZYbGFWMUUwVFhwcmQxcEVaekpOUjBWcFRFTktabGd6V1dsUGFrRnpTVzE0ZGxreVJuTkphbkEzU1c1Q2FHTXpUak5pTTBwclNXcHZhVXBFU21oS1JFRTBTa2hrYlZKc2NHOU9NMXBKWWxWb2JGSlhSVEpXVnpVMFdtNXZkMVl5VlhsaGVrNU1VbnBHVkZOWFVqVmpNMmhMWWxaR1YxRXhiRkJWUmtKeVZVWktTRlo2U1haYWExcFlTV2wzYVZwWE1XaGhWM2RwVDJsS2JXTXlkR2hqYms1MldrVkNhR1J0Um5WamVUVjFZa05LT1daUkxrUnlPVkZKWVZCTk5FVnFVVWxWYlZsQ1YxOWhNMlpLVEUxUFgyTXRTVE5CUlRJek5UTXdTSEEyYzNNaWZYMC55NWRwVUUtS0prd0hzUXYwWGFaX3VyQ3FQcnEwWDNVQ1l2cnQ4ZXBxNTRRIn19.2CtZ3YXQCdfVEm6OxJEdVR0nOW5QA3XMHg-ob2dvl74';
		
		var nameInput = form.find('#race_name');
		var raceData = { name: nameInput.val().trim() };
		
		var placeIds = placesAdded;
		$.ajax({
			method: 'DELETE',
			url: '/race/' + raceId + '/waypoints?format=json&token=' + muhToken
		}).done(function() {
			var nextRequest = function(index) {
				var returnable = function() {
					window.location.reload(true);
				};
				if(index < placeIds.length) {
					returnable = function() {
						$.ajax({
							url: '/race/' + raceId + '/waypoints?format=json&token=' + muhToken,
							method: 'POST',
							data: { pid: placeIds[index] }
						}).done(nextRequest(index + 1));
					}
				}
				return returnable;
			}
			var currentRequest = $.ajax({ method: 'PUT', url: '/race/' + raceId + '?format=json&token=' + muhToken, data: raceData });
			currentRequest.done(nextRequest(0));
		});
	}
	
	var createNewRaceSubmit = function(form) {
		var muhToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NzI3ZDNiYzlmM2UyZWQ4MzkwZDg2MGEiLCJfX3YiOjAsImxvY2FsIjp7InBhc3N3b3JkIjoiJDJhJDA4JHdmRlpoN3ZIbUhlRWE2VW54ZnowV2UyazNLRzFTSWR5c3hKbVFWQ1lPUFBrUFJHVzIvZkZXIiwiZW1haWwiOiJmc2thcnNvZEBhdmFucy5ubCIsInRva2VuIjoiZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKSVV6STFOaUo5LmV5SmZhV1FpT2lJMU56STNaRE5pWXpsbU0yVXlaV1E0TXprd1pEZzJNR0VpTENKZlgzWWlPakFzSW14dlkyRnNJanA3SW5CaGMzTjNiM0prSWpvaUpESmhKREE0SkhkbVJscG9OM1pJYlVobFJXRTJWVzU0Wm5vd1YyVXlhek5MUnpGVFNXUjVjM2hLYlZGV1ExbFBVRkJyVUZKSFZ6SXZaa1pYSWl3aVpXMWhhV3dpT2lKbWMydGhjbk52WkVCaGRtRnVjeTV1YkNJc0luUnZhMlZ1SWpvaVpYbEtNR1ZZUVdsUGFVcExWakZSYVV4RFNtaGlSMk5wVDJsS1NWVjZTVEZPYVVvNUxtVjVTbVpoVjFGcFQybEpNVTU2U1ROYVJFNXBXWHBzYlUweVZYbGFWMUUwVFhwcmQxcEVaekpOUjBWcFRFTktabGd6V1dsUGFrRnpTVzE0ZGxreVJuTkphbkEzU1c1Q2FHTXpUak5pTTBwclNXcHZhVXBFU21oS1JFRTBTa2hrYlZKc2NHOU9NMXBKWWxWb2JGSlhSVEpXVnpVMFdtNXZkMVl5VlhsaGVrNU1VbnBHVkZOWFVqVmpNMmhMWWxaR1YxRXhiRkJWUmtKeVZVWktTRlo2U1haYWExcFlTV2wzYVZwWE1XaGhWM2RwVDJsS2JXTXlkR2hqYms1MldrVkNhR1J0Um5WamVUVjFZa05LT1daUkxrUnlPVkZKWVZCTk5FVnFVVWxWYlZsQ1YxOWhNMlpLVEUxUFgyTXRTVE5CUlRJek5UTXdTSEEyYzNNaWZYMC55NWRwVUUtS0prd0hzUXYwWGFaX3VyQ3FQcnEwWDNVQ1l2cnQ4ZXBxNTRRIn19.2CtZ3YXQCdfVEm6OxJEdVR0nOW5QA3XMHg-ob2dvl74';
		
		var nameInput = form.find('#race_name');
		var raceData = { name: nameInput.val() };
		
		var placeIds = placesAdded;
		
		$.post('/race?format=json&token=' + muhToken, raceData, function(result, status, xhr) {
			var waypointPromises = [];
			for(placeId of placeIds) {
				waypointPromises.push($.post('/race/' + result._id + '/waypoints?format=json&token=' + muhToken, { pid: placeId }));
			}
			$.when(waypointPromises).done(function(waypointResults) {
				window.location.href = '/race/' + result._id;
			});
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