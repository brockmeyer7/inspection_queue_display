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
        UPC += e.key;
        if (UPC.length === 8) {
            update_jobs();
        }
    }
})

function update_jobs() {
    var body = JSON.stringify({ "UPC": UPC });

    var job_numbers = [...document.getElementsByClassName('job')];

    for (var i = 0; i < job_numbers.length; i++) {
        var job_number = job_numbers[i].getElementsByTagName('td')[1].innerHTML;
        var button = job_numbers[i].getElementsByTagName('td')[3];
        if (job_number === UPC) {
            var buttonText = button.getElementsByClassName('btn-block')[0].innerHTML;
            if (buttonText === 'Yes') {
                var program_required = true;
            }
            else {
                var program_required = false;
            }
            body = JSON.stringify({ "UPC": UPC, 'program_required': program_required });
        }
    }

    fetch(base_url + 'update_jobs', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: body
    })
        .then(() => { window.location.reload(true) });
}

[...document.querySelectorAll('.btn-block')].forEach(function (item) {
    item.addEventListener('click', function () {
        if (item.innerHTML === "No") {
            item.innerHTML = "Yes";
            item.classList.remove('btn-success');
            item.classList.add('btn-danger');
        }
        else {
            item.innerHTML = "No";
            item.classList.remove('btn-danger');
            item.classList.add('btn-success');
        }
    });
});