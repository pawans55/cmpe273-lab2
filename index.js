var connect = require('connect');
var login = require('./login');

var app = connect();

app.use(connect.json()); // Parse JSON request body into `request.body`
app.use(connect.urlencoded()); // Parse form in request body into `request.body`
app.use(connect.cookieParser()); // Parse cookies in the request headers into `request.cookies`
app.use(connect.query()); // Parse query string into `request.query`

app.use('/', main);

function main(request, response, next) {
        switch (request.method) {
                case 'GET': get(request, response); break;
                case 'POST': post(request, response); break;
                case 'DELETE': del(request, response); break;
                case 'PUT': put(request, response); break;
        }
};

function get(request, response) {
        var cookies = request.cookies;
        console.log(cookies);
        if ('session_id' in cookies) {
                var sid = cookies['session_id'];
                if ( login.isLoggedIn(sid) ) {
                        response.setHeader('Set-Cookie', 'session_id=' + sid);
                        response.end(login.hello(sid));
                } else {
                        response.end("Invalid session_id! Please login again\n");
                }
        } else {
                response.end("Please login via HTTP POST\n");
        }
};

function post(request, response) {
        var body = request.body;
        var name = body['name'];
        var email = body ['email'];
        var newSessionId = login.login(name, email);
        response.setHeader('Set-Cookie', 'session_id=' + newSessionId);
        response.end(login.hello(newSessionId));
};

function del(request, response) {
        var cookies = request.cookies;
        console.log("DELETE:Logged out from server");
        login.logout(cookies['session_id']);
        // TODO: remove session id via login.logout(xxx)
        // No need to set session id in the response cookies since you just logged out!
        response.end('Logged out from the server\n');
};

function put(request, response) {
        var cookies = request.cookies;
        var sessionId = cookies['session_id'];
        console.log(cookies);
             var newSessionId = login.refreshid(sessionId);       
        response.setHeader('Set-Cookie', 'session_id=' + newSessionId);
        console.log("PUT:: generate a new ID for the same user");
                response.end("Re-freshed session id =\n");
};

app.listen(8000);

console.log("Node.JS server running at 8000...");
