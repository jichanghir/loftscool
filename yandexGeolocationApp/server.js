var http = require('http'),
	fs = require('fs'),
	path = require('path'),
	config = {
		defaultPage : 'index.html',
		page404 : '404.html',
		mime : {
			'.html' : {
					type :'text/html',
					encoding : 'utf-8'
			},
			'.css' : {
					type : 'text/css',
					encoding : 'utf-8'
			},
			'.js' : {
					type : 'application/javascript',
					encoding : 'utf-8'
			},
			'.jpg' : {
					type : 'image/jpeg',
					encoding : ''
			},
			'.png' : {
					type : 'image/png',
					encoding : ''
			}
		}
	};

var comments = [];

function readFile(fileName, encoding) {
	return new Promise((resolve, reject) => {
		fs.readFile(fileName, encoding, function(error, content){
			if (error) {
				reject(error);
			}
			else {
				resolve(content);
			}
		});
	});
}

var server = http.createServer(function (request, response){

	// обработка get запросов
	if(request.method === "GET") {
		var url = request.url,
		target = './public' + url,
		code = 200;

		console.log('поступил запрос', url);

		if(url.indexOf('..') >= 1) {
			target = './public/404.html';
			code = 404;
		}

		if (url == '/') {
			target = './public/' + config.defaultPage;
		}

		if (!fs.existsSync(target)) {
			target = './public/' + config.page404;
			code = 404;
		}

		var extension = path.extname(target),
		mimeType = config.mime[extension].type,
		encoding = config.mime[extension].encoding;

		readFile(target, encoding)
		.then(content => {
			response.setHeader('Content-Type', `${mimeType}; charset=utf-8`);
			response.writeHead(code);
			response.write(content);
			response.end();
		});
	}

	// обработка post запросов
	if(request.method === "POST") {

		// добавляем комментарий
		function addNewComment(data) {
			var data = JSON.parse(data);

			var contains = false;
			if( comments.length > 0 ) {
				for( var key of comments ) {
					if( (key.coordsX === data.coordsX) && (key.coordsY === data.coordsY) ) {
						key.comment.push( data.comment[0] ); // 0 - потому что comment это массив, а надо добавить объект находящийся в этом массиве
						contains = true;
					}
				}
			}
			else {
				comments.push( data );
				contains = true;
			}

			if(!contains) {
				comments.push( data );
			}

		}

		// отдаем комментарии по координатам
		function getComments(data){
			var data = JSON.parse(data),
					result = '';

			for( var key of comments ) {
				if( (key.coordsX === data.coordsX) && (key.coordsY === data.coordsY) ) {
					console.log( 'key.comment', key.comment );
					rezult = JSON.stringify(key.comment);
				}
			}
			return rezult;
		}

		function getAllPlacemarks() {
			return JSON.stringify(comments);
		}

		// собственно обработка post запроса
		var data = '';
		request.on('data', function(chunk) {
			data += chunk.toString();
		});
		request.on('end', function() {


			if( data === 'getAllPlacemark' ) {
				console.log('getAllPlacemark', data);
				var rezult = getAllPlacemarks();
				response.end(rezult);
			}

			else {
				addNewComment(data); // добавляем комментарий

				var rezult = getComments(data); // получаем все комментарии по координатам
				response.end(rezult);
			}

		});
	}


});


server.listen(8485);
