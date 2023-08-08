var counters = document.getElementsByClassName('counter');
var keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-'];
var UPC = '';
var base_url = 'http://127.0.0.1:8000/';

for (var i = 0; i < counters.length; i++) {
    countdown(counters[i]);
}

function countdown(counter) {
    var timeCreated = new Date(counter.getAttribute('data-timeCreated')).getTime()

    var x = setInterval(function () {
        var now = new Date().getTime();
        var timeElapsed = now - timeCreated;
        var hours = Math.floor(timeElapsed / (1000 * 60 * 60));
        var minutes = Math.floor((timeElapsed % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((timeElapsed % (1000 * 60)) / 1000);

        counter.innerHTML = hours + 'h' + minutes + 'm' + seconds + 's';
    }, 1000)
}

document.addEventListener("keydown", function (e) {
    if (keys.indexOf(e.key) !== -1) {
        UPC += e.key
        console.log(UPC.length)
        if (UPC.length === 8) {
            update_jobs();
        }
    }
})

function update_jobs() {
    fetch(base_url + 'update_jobs', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "UPC": UPC })
    })
        .then(() => { window.location.reload(true) });
}