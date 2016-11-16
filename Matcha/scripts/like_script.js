document.querySelectorAll(".like").forEach(function (item) {
    $(item).click(function () {
        $.post(
            '/match/like',
            {
                liked_user: $(item).attr('name'),
                liker_user: $(item).attr('id'),
                state: $(item).attr('value')
            },

            function DoYouLikeMe(data) {
                var button,
                    liked_user = $(item).attr('name');

                if (data === "success") {
                    button = $("button[name='" + liked_user + "']");
                    button.val() == "Like" ? button.val("Dislike") : button.val("Like");
                    if (button.val() == "Dislike")
                        button.html('<i class="heart icon"></i>Dislike')
                    else
                        button.html('<i class="heart icon"></i>Like')
                    button.toggleClass("red");
                }
            },
            'text'
        );
    });
});
