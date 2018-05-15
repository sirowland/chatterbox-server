// //write jquery that interacts with dom
$(document).ready(function() {

  $('#roomSelect').on('click', '#option', function(event) {
    var element = $(event.target);
  });
  
  //FRIEND UNFRIEND BUTTON
  $('body').on('click', '#userName', function(event) {
    var element = $(event.target);
    var username = element[0].innerHTML;
    
    app.handleUsernameClick(username, event);
  });
  
  //SUBMIT BUTTON
  $('#send').on('click', function(event) {
    //access app.send with a message
    console.log($('#addRoom'));

    var addroom = $('#addRoom')[0];

    var roomname = addroom ? $('#addRoom')[0].value : $("#roomSelect :selected").text().trim();
    
    var message = {
      username: app.username,
      roomname: roomname,
      text: $("#input")[0].value
    }
    
    $("#input")[0].value = '';
    
    app.send(message);
    app.renderRoom(roomname);
    app.filterRoom(roomname);
    
    $('#roomInput').remove();
  });
  
  $('#filter').on('click', function(event) {
    //access app.send with a message
    var room = $("#roomSelect :selected").text();
    
    app.filterRoom(room);
  });
  
  
  //USERNAME CSS
  $('body').on('mouseenter', '#userName', function(event) {
    $(event.target).addClass('hover-username');
  });
  
  $('body').on('mouseleave', '#userName', function(event) {
    $(event.target).removeClass('hover-username');
  });
  
  //call refresh page
  $('#refresh').on('click', function(event) {
    var roomname = $("#roomSelect :selected").text();
    app.refreshPage(roomname);
  });
  
  //insert and remove room add input
  $('#add').on('click', function(event) {
    if (app.added === false) {
      app.added = true;
      $(event.target).after(`<div id="roomInput"><h3>Add room below then Send a message!</h3><input id="addRoom" defaultValue="Add room here"></input></div>`);
    } else {
      app.added = false;
      $(event.target).next('div').remove();
    }
  });
  
});