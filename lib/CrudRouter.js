// CrudRouter.js
// Modifies the given router to have RESTful CRUD handlers.
//
// URL	METHOD	RESULT
// /	POST	create modelName
// /	GET		returns collection
// /:id	GET		returns modelName with :id
// /:id	PUT		updates modelName with :id
// /:id DELETE	deletes modelName with :id

// parameter `router`
// - router to be modified
// parameter `modelName`
// - unique name for the modelName
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

module.exports = function(router, modelName, repository, options, html, authHandler)
{	
	// make sure options is defined
	// default: read-only
	options = options || {
		read: function(req, res){ return {}; },
		readById: function(req, res){ return req.params[modelName + 'Id'] }
	};
	
	// make sure html is defined
	html = html || {};
	html.overview = html.overview || {};
	html.detail = html.detail || {};
	
	// handlers
	var viewHandler = function(viewObject) {
		return function(req, res) {
			var publicData = {};
			if(Array.isArray(req[modelName].result)) {
				publicData.count = req[modelName].count;
				publicData.result = [];
				for(element of req[modelName].result) {
					publicData.result.push(element.asPublic());
				}
			}
			else {
				publicData = req[modelName].asPublic();
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
			res.status(status).json({ status: status, message: 'success' });
		}
	}
	var createHandler = function() {
		return function(req, res) {
			return res.status(201).json(req[modelName].asPublic())
		}
	}
	
	if(options.read) {
		// GET /entity
		var routeHandlers = [];
		routeHandlers.push(authHandler.isAuthorized(modelName + '-read'));
		routeHandlers.push(repository.read(options.read));
		routeHandlers.push(viewHandler(html.overview));
		
		router.get('/', routeHandlers);
	}
	
	if(options.create) {
		// POST /entity
		
		var routeHandlers = [];
		routeHandlers.push(authHandler.isAuthorized(modelName + '-create'));
		routeHandlers.push(repository.create(options.create));
		routeHandlers.push(createHandler());
		
		router.post('/', routeHandlers);
	}

	if(options.readById || options.update || options.delete) {
		// ANY /entity/:id
		router.param(modelName + 'Id', repository.readById(options.readById));
	}
	
	if(options.readById) {
		// GET /entity/:id
		router.get('/:' + modelName + 'Id',
			authHandler.isAuthorized(modelName + '-readById'),
			viewHandler(html.detail));
	}
	
	if(options.update) {
		// PUT /entity/:id
		var routeHandlers = [];
		routeHandlers.push(authHandler.isAuthorized(modelName + '-update'));
		routeHandlers.push(repository.update(options.update));
		routeHandlers.push(statusHandler(204));
		
		router.put('/:' + modelName + 'Id', routeHandlers);
	}

	if(options.delete) {
		// DELETE /entity/:id
		var routeHandlers = [];
		routeHandlers.push(authHandler.isAuthorized(modelName + '-delete'));
		routeHandlers.push(repository.remove());
		routeHandlers.push(statusHandler(204));
		
		router.delete('/:' + modelName + 'Id', routeHandlers);
	}
}