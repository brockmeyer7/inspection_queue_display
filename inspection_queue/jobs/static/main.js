var counters = document.getElementsByClassName('counter');
var keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-']
var jobUPC = ''

var base_url = 'http://127.0.0.1:8000/'
console.log(counters);
console.log(counters.length);

for (var i = 0; i < counters.length; i++) {
    console.log(counters[i])
    countdown(counters[i]);
}

function countdown(counter) {
    console.log(counter.getAttribute('data-timeCreated'))
    var timeCreated = new Date(counter.getAttribute('data-timeCreated')).getTime()

    var x = setInterval(function () {
        var now = new Date().getTime();
        var timeElapsed = now - timeCreated;
        var hours = Math.floor((timeElapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((timeElapsed % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((timeElapsed % (1000 * 60)) / 1000);

        counter.innerHTML = hours + 'h' + minutes + 'm' + seconds + 's';
    }, 1000)
}

document.addEventListener("keydown", function (e) {
    if (keys.indexOf(e.key) !== -1) {
        UPC += e.key
        if (UPC.length === 8) {
            // add_job()
            this.location.reload()
        }
    }
})

// function add_job() {
//     fetch(base_url + 'add_job', {
//         method: 'POST',
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ "UPC": UPC })
//     })
//         .then(response => response.json())
// }