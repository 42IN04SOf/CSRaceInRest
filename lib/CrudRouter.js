module.exports = function(router, model, repository, options, html)
{	
	// make sure html is defined
	html = html || {};
	html.overview = html.overview || {};
	html.detail = html.detail || {};
	
	// make sure options is defined
	options = options || {
		read: true
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
				publicData.message = viewObject.message;
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
		routeHandlers.push(repository.delete);
		routeHandlers.push(statusHandler(201));
		
		router.delete('/:id', routeHandlers);
	}
}