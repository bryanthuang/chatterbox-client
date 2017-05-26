// YOUR CODE HERE:
var app = {};

app.init = function() {};
app.send = function() {
  $.ajax({
    type: "POST",
    url: "http://parse.sfm6.hackreactor.com/chatterbox/classes/messages",
    //data: data,
    //success: success,
    //dataType: dataType
  });
};
app.fetch = function() {
  $.ajax({
    type: "GET",
    url: "http://parse.sfm6.hackreactor.com/chatterbox/classes/messages",
    //data: data,
    //success: success,
    //dataType: dataType
  });
};
