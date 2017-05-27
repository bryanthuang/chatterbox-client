// YOUR CODE HERE:
var app = {
  server: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
};

app.init = function() {
  $(document).ready(function () {
    app.fetch();
    var URL = window.location.href;
    $('form').on('submit', event => {
      event.preventDefault();
      app.send({
        username: URL.slice(URL.indexOf('=') + 1),
        text: $(".inputField").val(),
        roomName: 'changeMe'
      });
      app.fetch();
    });    
  
  });
};

app.send = function(message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
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
    data: 'order=-createdAt',
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
  // message = app.escape(message);
  // username = app.escape(username);
  $('#chats').append(`<div><p class="username">${index}${xssFilters.inHTMLData(username)} :</p><p class="chat">${xssFilters.inHTMLData(message)}</p></div>`);
  
};

app.renderRoom = function(roomName) {
  $('#roomSelect').wrapInner(`<option value=${roomName}>${roomName}</option>`);
};

// app.escape = function (input) {
//   //console.log(input);
//   if (input !== undefined) {
//     input.replace('<', '');
//   }
//   //console.log(input);
//   return input;
// };


// function encodeID(s) {
//   if (s==='') return '_';
//   return s.replace(/[^a-zA-Z0-9.-]/g, function(match) {
//       return '_'+match[0].charCodeAt(0).toString(16)+'_';
//   });
// }


app.init();















