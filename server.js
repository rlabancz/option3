var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var qs = require('querystring');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

var device;

var device_list = [];

app.get('/option3', function(req, res) {
 res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(device_list));
    });

app.post('/option3', function(req, res) {
    device = req.body.message;

 console.log(req.body);
    device_list.push(device);
    io.emit('message', device);
    res.end('ok');

    /*
    var body = '';
    req.on('data', function(data) {
        body+=data;
    });
    req.on('end', function() {
        console.log(body);
        device = qs.parse(body).message;
        device_list.push(device);
        io.emit('message', device);
                res.end('ok');
    });
    */
});

http.listen(8099, function(){
    console.log('listening on *:8099');
});

io.on('connection', function(socket) {
    console.log('a user connected');
    device_list.forEach(function(message) {
        socket.emit('message', message);
    });
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
    socket.on('message', function(msg){
        console.log(msg);
        io.emit('message', msg);
            });
});
