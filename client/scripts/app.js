// YOUR CODE HERE:
var app = {
  server: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
  friends: {},
  // server: "http://parse.sfm8.hackreactor.com/chatterbox/classes/messages"
};

app.init = function() {
  $(document).ready(function () {
    var messageObjs = {};
    var currentRoom;
   
    app.fetch(messageObjs);
    setTimeout(function() {
      app.fetch(messageObjs);
    }, 1000);

    for (var key in messageObjs) {
      app.renderMessage(messageObjs[key].username, messageObjs[key].text, messageObjs);
    }
    
    var URL = window.location.href;
    $('form').on('submit', event => {
      event.preventDefault();
      app.send({
        username: URL.slice(URL.indexOf('=') + 1),
        text: $('.inputField').val(),
        roomName: currentRoom
      });
      app.clearMessages();
      app.fetch(messageObjs);
    });

    $('#roomSelect' ).change(function() {
      currentRoom = $('select option:selected').text();
      var messageArr = [];
      app.clearMessages();
      if ($('select option:selected').text() === 'All') {
        for (var key in messageObjs) {
          app.renderMessage(messageObjs[key].username, messageObjs[key].text, messageObjs);
        }
      }

      for (var key in messageObjs) {
        if (messageObjs[key].roomname === $('select option:selected').text()) {
          messageArr.push(messageObjs[key]);
        }
      }
      for ( var i = 0; i < messageArr.length; i++) {
        app.renderMessage(messageArr[i].username, messageArr[i].text, messageObjs);
      }

      //filter rooms in obj
      //only renderMessage specific room
    });    
  });
};

app.send = function(message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: this.server,
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

app.fetch = function(obj) {
  
  var verifyMessage = function (message) {
    return message === undefined ? 'undefined' : message;
  };
  
  var verifyRoom = function (nameOfRoom) {
    return nameOfRoom === undefined || nameOfRoom === 'undefined' || nameOfRoom.length <= 0 ? nameOfRoom = 'All' : nameOfRoom;
  };

  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: this.server,
    type: 'GET',
    data: 'order=-createdAt',
    contentType: 'application/json',
    success: function (data) {
      //sort content based on roomname
      console.log('chatterbox: Message received');
      for (var i = 0; i < 10; i++) {
        obj[i] = {};
        obj[i].username = verifyMessage(xssFilters.inHTMLData(data.results[i].username));
        obj[i].text = verifyMessage(xssFilters.inHTMLData(data.results[i].text));
        obj[i].roomname = verifyRoom(xssFilters.inHTMLData(data.results[i].roomname));
      }
      var uniqueRoom = [];
      for (var key in obj) {
        uniqueRoom.push(obj[key].roomname);
      } 
      uniqueRoom.sort();
      uniqueRoom = _.uniq(uniqueRoom);
      for (var i = 0; i < uniqueRoom.length; i ++) {
        app.renderRoom(uniqueRoom[i]);
      }

    },
    error: function (data) {
      console.error('chatterbox: Failed to retrieve message', data);
    }
  });
};

app.clearMessages = function () {
  $('#chats').children().remove();
};

app.renderMessage = function(username, message, obj) {
  $('#chats').prepend(`<div class="chat"><a id=${username} class="username" href="#")>${xssFilters.inHTMLData(username)}: </a> <p>${xssFilters.inHTMLData(message)}</p></div>`);
  $('.username').attr('onclick', 'app.handleUsernameClick(event)');
  //$('#chats').prepend(`<div class="chat"><a id=${xssFilters.inHTMLData(username)} class="username" href="#" onclick=app.handleUsernameClick(${username})>${xssFilters.inHTMLData(username)}: </a> <p>${xssFilters.inHTMLData(message)}</p></div>`);
};

app.renderRoom = function(roomName) {
  if (roomName === 'All') {
    return;
  } else {
    $('#roomSelect').append(`<option value=${roomName}>${roomName}</option>`);
  }
 
};

app.handleUsernameClick = function (event) {
  app.friends[event.target.id] = true;
};

app.handleSubmit = function(){
}

app.init();