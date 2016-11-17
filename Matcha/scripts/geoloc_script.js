function geolocate(){
    $.post(
        '/user/geolocate',
        {
            permission: true
        },
        function displayNotification() {
        },
        'text'
    )
}

function errorhandling(error){
    $.post(
        '/user/geolocate',
        {
            permission: false
        },
        function displayNotification() {
        },
        'text'
    )
}

if(navigator.geolocation)
    navigator.geolocation.getCurrentPosition(geolocate, errorhandling);