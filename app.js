var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// console.log(http);
// console.log("http listen", http.listen);


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

//csv
var fs = require('fs');
var wstream = fs.createWriteStream('my.csv');
var csv=require('csv');

// var csvWriter = csv.to.file('my.csv', {flags:'a+'});
var csvWriter = csv.stringify();
// set up pipeline
csvWriter.pipe(wstream);

var screenSize = robot.getScreenSize();
var height = screenSize.height;
var width = screenSize.width;

var circleBuffer=function(size){
  this.items=[];
  this.maxSize=size;
  this.replacementIndex=0;
  this.full=false;
}
circleBuffer.prototype.push=function(item){
  this.full=false;
  if(this.items.length<this.maxSize){
    this.items.push(item)
  }
  else{
    this.full=true;
    this.items[this.replacementIndex]=item
    this.replacementIndex++
    if(this.replacementIndex===this.maxSize){
      this.replacementIndex=0
    }
  }
}
var pos = new circleBuffer(50);
var mouse=[];
var eye=[];
io.on('connection', function(socket){
  socket.on('gaze', function(data, clock){
      if(data){

        pos.push([data.x,data.y])
        if(pos.full){
        //var mouse = robot.getMousePos()
        if(pos.replacementIndex){
        var mouseX = pos.items[pos.replacementIndex][0]*.8
        var mouseY = pos.items[pos.replacementIndex][1]*.8  
        }
        else{
          var mouseX = pos.items[0][0]*.8;
          var mouseY = pos.items[0][1]*.8
        }
        robot.moveMouse(mouseX,mouseY);
        }
        
      }
    })
      setTimeout(function(){socket.on('calibration', function(data){
        var m=robot.getMousePos();
      if(data){
        eye.push(data.x,data.y)
        mouse.push(m.x,m.y)
        
        csvWriter.write([data.x,data.y,m.x,m.y])
      }
      if(eye.length===100){
        console.log(eye,'eye')
        console.log(mouse,'mouse')
      }
    })},5000)

      socket.on('disconnect', function(socket){
        setTimeout(function(){csvWriter.end()},500)
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

// // For arduino stuff
// var serialport = require('serialport');
// var portName = 'COM5';
// var sp = new serialport.SerialPort(portName, {
//     baudRate: 9600,
//     dataBits: 8,
//     parity: 'none',
//     stopBits: 1,
//     flowControl: false,
//     parser: serialport.parsers.readline("\r\n")
// });

// sp.on('data', function(input) {
//   //console.log(input);

//   // For calibration testing
//   if (input === "left_click") {
//     var position = getMousePos();
//     console.log(position);
//   }

//   // if (input === "mouse") {
//   //   robot.mouseClick();
//   // }
//   // if (input === "left_click") {
//   //   robot.mouseToggle("down");
//   // }
//   // if (input === "left_unclick") {
//   //   robot.mouseToggle("up");
//   // }
//   // if (input === "right_click") {
//   //   robot.mouseToggle("down", "right");
//   // }
//   // if (input === "right_unclick") {
//   //   robot.mouseToggle("up", "right");
//   // }
//   // if (input < 300 && input > 150) {
//   //   robot.scrollMouse(1, "down");  
//   // }
//   // if (input < 150) {
//   //   robot.scrollMouse(3, "down");
//   // }
//   // if (input > 600 && input < 850) {
//   //   robot.scrollMouse(1, "up");
//   // }
//   // if (input > 850) {
//   //   robot.scrollMouse(3, "up");
//   // }


  
// });


module.exports = {
  app: app,
  server: http
};