var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
var robot = require("robotjs");
//Speed up the mouse.

var screenSize = robot.getScreenSize();
var height = screenSize.height;
var width = screenSize.width;
var x=[];
var y=[];
io.on('connection', function(socket){
  socket.on('gaze', function(data, clock){
      if(data){
         x.push(data.x)
         y.push(data.y)
         if(x.length===20){
           var xAvg=x.reduce(function(a,b){
            return a+b
           })/x.length;
           var yAvg=y.reduce(function(a,b){
            return a+b
           })/x.length;
           console.log(xAvg,yAvg)
           robot.moveMouseSmooth(xAvg,yAvg)
           x=[];
           y=[];
         }
      }
        
  })
  socket.on('calibration', function(data){
    if(data){
      mousePos=robot.getMousePos()
      xOff=mousePos.x-x.data;
      yOff=mousePos.y-y.data;
      console.log(xOff,yOff)
    }
  })
})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = {
  app: app,
  server: server
};