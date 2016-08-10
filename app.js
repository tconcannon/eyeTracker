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

// For arduino stuff
var serialport = require('serialport');
var portName = 'COM5';
var sp = new serialport.SerialPort(portName, {
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false,
    parser: serialport.parsers.readline("\r\n")
});

sp.on('data', function(input) {
  //console.log(input);

  // For calibration testing
  if (input === "left_click") {
    var position = getMousePos();
    console.log(position);
  }

  // if (input === "mouse") {
  //   robot.mouseClick();
  // }
  // if (input === "left_click") {
  //   robot.mouseToggle("down");
  // }
  // if (input === "left_unclick") {
  //   robot.mouseToggle("up");
  // }
  // if (input === "right_click") {
  //   robot.mouseToggle("down", "right");
  // }
  // if (input === "right_unclick") {
  //   robot.mouseToggle("up", "right");
  // }
  // if (input < 300 && input > 150) {
  //   robot.scrollMouse(1, "down");  
  // }
  // if (input < 150) {
  //   robot.scrollMouse(3, "down");
  // }
  // if (input > 600 && input < 850) {
  //   robot.scrollMouse(1, "up");
  // }
  // if (input > 850) {
  //   robot.scrollMouse(3, "up");
  // }

  // THIS SEEMED TO BREAK MY COMPUTER BUT WHY?
  // switch (input) {
  //   case "left_click":
  //     robot.mouseToggle("down");
  //     break;
  //   case "left_unclick":
  //     robot.mouseToggle("up");
  //     break;
  //   case "right_click":
  //     robot.mouseToggle("down", "right");
  //     break;
  //   case "right_unclick":
  //     robot.mouseToggle("down", "right");
  //     break;
  //   case (input < 300 && input > 150):
  //     robot.scrollMouse(1, "down");
  //     break;
  //   case (input < 150):
  //     robot.scrollMouse(3, "down");
  //     break;
  //   case (input > 600 && input < 850):
  //     robot.scrollMouse(1, "up");
  //     break;
  //   case (input > 850):
  //     robot.scrollMouse(3, "up");
  //     break;
  //   default:
  //     break;
  // }
  
});


module.exports = {
  app: app,
  server: server
};