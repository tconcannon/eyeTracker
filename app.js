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
var xOff=0;
var yOff=0;

///calibation
robot.moveMouseSmooth(0,0)
setTimeout(function(){
  robot.moveMouseSmooth(width-20,0)
},1000)
setTimeout(function(){
  robot.moveMouseSmooth(width-20,height-20)
},2000)
setTimeout(function(){
  robot.moveMouseSmooth(0,height-20)
},3000)

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
           console.log(xAvg,yAvg, 'averages')
           robot.moveMouseSmooth(xAvg,yAvg)
           x=[];
           y=[];
         }
      }
        
  })
  socket.on('calibration', function(data){
    if(data){
      // if(robot.mouseClick()){
      //   console.log('clicked')
      // }
      mousePos=robot.getMousePos()
      xOff=mousePos.x-data.x;
      yOff=mousePos.y-data.y;
      // console.log(xOff,yOff, 'offsets')
      // console.log(data.x,mousePos.x,'x')
      // console.log(data.y,mousePos.y,'y')
    }
  })
})
// addEventListener("click", function(){
//         console.log('clicked')
//       })

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