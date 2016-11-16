var t = setInterval(checkNotification, 1000);


function checkNotification() {
    var userId = document.querySelector('.user');
    $.post(
        '/user/notification',
        {
            receiver: $(userId).attr('id')
        },
        function displayNotification(new_notification) {
            var flag;
            var chat;

            if (new_notification == "chat"){
                chat = $("a[id=chat]");
                chat.html('Chat Room<i class="red talk icon"></i>')
            }
            else if (new_notification == "flag"){
                flag = $("a[id=notifications]");
                flag.html('<i class="red flag icon"></i>');
            }
        },
        'text'
    )
}