var counters = document.getElementsByClassName('counter');
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