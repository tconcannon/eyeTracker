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
robot.setMouseDelay(2);

var twoPI = Math.PI * 2.0;
var screenSize = robot.getScreenSize();
var height = screenSize.height;
var width = screenSize.width;

console.log(height,'height')
console.log(width, 'width')
io.on('connection', function(socket){
  var x =[];
  var y =[];
  var xAvg;
  var yAvg;
  socket.on('gaze', function(data){
   // console.log(data, 'data')
    // console.log(x.length, 'x l')
    // console.log(y.length, 'y l')
  
    //Move the mouse across the screen as a sine wave.
    setInterval(function(){
       if(data && data.x && data.y){
        x.push(data.x)
        y.push(data.y)
      
      var length=x.length;
      xAvg=x.reduce(function(a,b){
        return a+b;
      })/length;
      yAvg=y.reduce(function(a,b){
        return a+b;
      })/length;
      // console.log(xAvg,'x arr')
      // console.log(yAvg,'y arr')
      if(data && data.y && data.x){
      //robot.moveMouse(xAvg, yAvg);  
    }
  }
    },1000)
    // y = height * Math.sin((twoPI * x) / width) + height;
    // if(data && data.y && data.x){
    //   robot.moveMouse(xAvg, yAvg);  
    // }
    
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