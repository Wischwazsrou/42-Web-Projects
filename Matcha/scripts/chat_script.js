var socket = io();
var userWritting = document.querySelector('#m');
var userId = document.querySelector('.user');
var receiverId = document.querySelector('.receiver');
var display = document.querySelector('#new_message');
var style = document.querySelector('#message_style');

$('form').submit(function(){
    $.post(
        '/user/chat',
        {
            sender: $(userId).attr('id'),
            receiver: $(receiverId).attr('id'),
            message: $('#m').val()
        },
        function displayMessage() {
            socket.emit('chat message', $('#m').val());
            $('#m').val('');
            return false;
        },
        'text'
    )
});
socket.on('chat message', function(msg){
    $('#messages').append($('<p>').text(msg));
    $(display).css('display', 'block');
    if ($(userWritting).attr('name') !== $(userId).attr('id').toString()){
        style.setAttribute('class', "ui floating teal compact message")
    }
    else{
        style.setAttribute('class', "ui floating compact message")
    }

});