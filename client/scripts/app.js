// YOUR CODE HERE:
var app = {
  server: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
};

app.init = function() {
  $(document).ready(function () {
    app.fetch();

  });
};

app.send = function(message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
    type: 'POST',
    data: message,
    contentType: 'application/json',
    success: function (data) {
      console.log(data);
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch = function() {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
    type: 'GET',
    data : 'order=-createdAt',
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message received');
      console.log(data);
      
      for (var i = 0; i < 10; i++) {
        // console.log(JSON.stringify(data.results[i]));
        app.renderMessage(JSON.stringify(data.results[i].text), data.results[i].username, i);
      }
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to retrieve message', data);
    }
  });
};

app.clearMessages = function () {
  $('#chats').children().remove();
};

app.renderMessage = function(message, username, index) {
  $('#chats').prepend(`<div><p class="username">${index}${username} :</p><p class="chat">${message}</p></div>`);
  
};

app.renderRoom = function(roomName) {
  $('#roomSelect').wrapInner(`<option value=${roomName}>${roomName}</option>`);
};

app.init();