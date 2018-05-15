// YOUR CODE HERE:
var app = {
  server: 'http://127.0.0.1:3000/classes/messages',
  messages: [],
  rooms: {},
  friends: {},
  objectIds: {},
  username: window.location.search.substring(10),
  added: false,

  
  init: function() {
    app.fetch();
  },
  
  send: function(message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent', data);
        app.fetch();
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },
  
  fetch: function() {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        data = JSON.parse(data);

        if (app.messages.length === 0) {
          app.messages = data.results.reverse();
          
          //render all messages and rooms
          _.each(app.messages, function(message) {
            app.renderMessage(message);
            app.objectIds[message.objectId] = message.objectId;
            
            var roomName = message.roomname;
            
            //check if we have it in our rooms array if not add and append it
            if (app.rooms[roomName] === undefined) {
              app.rooms[roomName] = roomName;
              app.renderRoom(roomName);
            }
          });
        } else {
          //if you send a message refetch data
          _.each(data.results, function(message) {
            var objId = message.objectId;
            if (app.objectIds[objId] === undefined) {
              app.objectIds[objId] = objId;
              app.messages.push(message);
              app.renderMessage(message);
            }
          })
          
        }
        app.friended();  
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to fetch', data);
      }
    });
  },
  
  clearMessages: function() {
    $('#chats').empty();
  },
  
  renderMessage: function(message) {
    //create node
    
    // var username = app.escapeHTML(message.username);
    var text = app.escapeHTML(message.text);
    
    messageDiv = $(`<div class="messageDiv" id="${message.objectId}">
                      <div id="userName">${message.username}</div>
                      <div id="message">${text}</div>
                    </div>`);
   
    //append node
    $('#chats').prepend(messageDiv);
  },
  
  renderRoom: function(roomName) {
    selectOption = $(`<option id="option"> ${roomName} </option>`);
    
    $('#roomSelect').append(selectOption);
  },
  
  filterRoom: function(roomName) {
    roomName = roomName.trim();
    app.clearMessages();
    
    _.each(app.messages, function(message) {
      if (message.roomname === roomName) {
        app.renderMessage(message);
      }
    });
  },
  
  handleUsernameClick: function(username, element) {
    if (app.friends[username] === undefined || app.friends[username] === false) {
      app.friends[username] = true;
    } else {
      app.friends[username] = false;
    }
    
    app.friended(username);
  },
  
  friended: function(username) {
    var friends = app.friends;
    
    _.each(friends, function(friended, friend) {
      
      var bool = friended;
      
      _.each(app.messages, function(message){
        
        if (bool && message.username === friend) {
          $('#'+message.objectId).addClass('friend');
        } else if (!bool && message.username === friend) {
          $('#'+message.objectId).removeClass('friend');
        }
      });
    })
  },
  
  refreshPage: function(roomname) {
    app.fetch();
    app.filterRoom(roomname);
  },
  
  escapeHTML: function(str) {
     str = str + "''";
     var out = "''";
     for(var i=0; i<str.length; i++) {
         if(str[i] === '<') {
             out += '&amp;lt;';
         } else if(str[i] === '>') {
             out += '&amp;gt;';
         } else if(str[i] === '"') {
             out += '&amp;quot;';                        
         } else {
             out += str[i];
         }
     }
     return out;                    
  }
  
  
  
};

app.init();


