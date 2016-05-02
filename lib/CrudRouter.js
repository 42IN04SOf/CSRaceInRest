// CrudRouter.js
// Modifies the given router to have RESTful CRUD handlers.
//
// URL	METHOD	RESULT
// /	POST	create model
// /	GET		returns collection
// /:id	GET		returns model with :id
// /:id	PUT		updates model with :id
// /:id DELETE	deletes model with :id

// parameter `router`
// - router to be modified
// parameter `model`
// - unique name for the model
// - example: Race, User etc...
// parameter `repository`
// - repository to read/write to the database.
// parameter `options` : optional
// - specify which handlers should be added.
// - default: read-only
// parameter `html` : optional
// - specify if GET-requests should return html-pages
// - example of html:
//		html = {
// 			overview: { title: 'race.overviewTitle', bag: { 'key1': 'value1', 'key2': 'value2' }, view: 'Races' },
// 			detail: { title: 'race.detailTitle', bag: { 'key1': 'something_that_my_view_needs' }, view: 'Race' },
//		}
// - explanation:
//		@GET /
//			returns Races.ejs (from html.overview.view)
// 			with title race.overviewTitle (from html.overview.title, will be translated)
// 			html.overview.bag contains values for the view the be used however necessary.
//		@GET /:id
//			returns Race.ejs (from html.detail.view)
// 			with title race.detailTitle (from html.detail.title, will be translated)
// 			html.detail.bag contains values for the view the be used however necessary.

module.exports = function(router, model, repository, options, html)
{	
	// make sure html is defined
	html = html || {};
	html.overview = html.overview || {};
	html.detail = html.detail || {};
	
	// make sure options is defined
	// default: read-only
	options = options || {
		read: true,
		readById: true
	};
	
	// handlers
	var viewHandler = function(viewObject) {
		return function(req, res) {
			var publicData = [];
			if(Array.isArray(req[model])) {
				for(element of req[model]) {
					publicData.push(element.asPublic());
				}
			}
			else {
				publicData = req[model].asPublic();
			}
			if(res.isHTMLRequested()) {
				publicData = { data: publicData };
				publicData.title = viewObject.title;
				publicData.bag = viewObject.bag;
			}
			res.return({ result: publicData, view: viewObject.view });
		}
	}
	var statusHandler = function(status) {
		return function(req, res) {
			res.status(status).end('complete');
		}
	}
	
	if(options.read) {
		// GET /entity
		var routeHandlers = [];
		if(options.read.pre) { routeHandlers.push(options.read.pre); }
		routeHandlers.push(repository.read);
		routeHandlers.push(viewHandler(html.overview));
		
		router.get('/', routeHandlers);
	}
	
	if(options.create) {
		// POST /entity
		
		var routeHandlers = [];
		if(options.create.pre) { routeHandlers.push(options.create.pre); }
		routeHandlers.push(repository.create);
		routeHandlers.push(statusHandler(201));
		
		router.post('/', routeHandlers);
	}

	if(options.readById || options.update || options.delete) {
		// ANY /entity/:id
		router.param('id', repository.readById);
	}
	
	if(options.readById) {
		// GET /entity/:id		
		router.get('/:id', viewHandler(html.detail));
	}
	
	if(options.update) {
		// PUT /entity/:id
		var routeHandlers = [];
		if(options.update.pre) { routeHandlers.push(options.update.pre); }
		routeHandlers.push(repository.update);
		routeHandlers.push(statusHandler(201));
		
		router.put('/:id', routeHandlers);
	}

	if(options.delete) {
		// DELETE /entity/:id
		var routeHandlers = [];
		routeHandlers.push(repository.remove);
		routeHandlers.push(statusHandler(201));
		
		router.delete('/:id', routeHandlers);
	}
}