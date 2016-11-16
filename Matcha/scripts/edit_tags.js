function add_tag(){
    var tag = document.getElementById("tag");
    tag.setAttribute("type", "text");
}

function remove_tag() {
    document.querySelectorAll("#tags").forEach(function (tag) {
        $(tag).click(function () {
            $.post(
                '/user/remove_tags',
                {
                    tag: $(tag).attr('name')
                },

                function RemoveTag(data) {
                    var div;
                    tag = $(tag).attr('name');
                    if (data === "success") {
                        div = $("div[name='" + tag + "']");
                        div.css('display', "none");
                    }
                },
                'text'
            );
        });
    });
}