$(document).ready(function() {
	console.log('tooltips');
	$('body').tooltip({
		selector: '[data-toggle="tooltip"]'
	});
});