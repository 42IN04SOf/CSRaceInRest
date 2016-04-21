module.exports = function(router, repository, options, html)
{
	if(options.read) {
		// GET /entity
		router.get('/', repository.read, function(req, res, next) {
			if(res.isHTMLRequested()) {
				req[model] = { result: req[model] };
				req[model].title = html.overview.title;
				req[model].message = html.overview.message;
			}
			res.return({ result: req[model], view: html.overview.view });
		});
	}
	
	if(options.create) {
		// POST /entity
		router.post('/', repository.create, function(req, res) {
			res.sendStatus(201);
		});
	}

	if(options.readById) {
		// ANY /entity/:id
		router.param('id', repository.readById);
		
		// GET /entity/:id
		router.get('/:id', function (req, res){
			if(res.isHTMLRequested()) {
				req[model] = { result: req[model] };
				req[model].title = html.detail.title;
				req[model].message = html.detail.message;
			}
			res.return({ result: req[model], view: html.detail.view });
		});
	}

	if(options.update) {
		// PUT /entity/:id
		router.put('/:id', repository.update, function(req, res) {
			res.sendStatus(201);
		});
	}

	if(options.delete) {
		// DELETE /entity/:id
		router.delete('/:id', repository.delete, function(req, res) {
			res.sendStatus(201);
		});
	}
}