var counters = document.getElementsByClassName('counter');
var keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-'];
var UPC = '';
var base_url = 'http://10.10.10.152:8000/';

// Execute countdown function on all timers in DOM
for (var i = 0; i < counters.length; i++) {
    countdown(counters[i]);
}

// Timer function
function countdown(counter) {
    var timeCreated = new Date(counter.getAttribute('data-timeCreated')).getTime()

    var x = setInterval(function () {
        var now = new Date().getTime();
        var timeElapsed = now - timeCreated;
        var hours = Math.floor(timeElapsed / (1000 * 60 * 60));
        var minutes = Math.floor((timeElapsed % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((timeElapsed % (1000 * 60)) / 1000);

        counter.innerHTML = hours + 'h' + minutes + 'm' + seconds + 's';
    }, 1000);
}

// Event listener waiting for scan of job barcode
document.addEventListener("keydown", function (e) {
    if (keys.indexOf(e.key) !== -1) {
        UPC += e.key;
        console.log(UPC);
        if (UPC.length === 8) {
            update_jobs();
        }
    }
});

// Query API to add or remove job when scanned into system
function update_jobs() {
    var body = JSON.stringify({ "UPC": UPC });

    fetch(base_url + 'update_jobs', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: body
    })
        .then(() => { window.location.reload(true) });
}

// Query API to update database with new 'program_required' information
async function put_json(job_number) {

    let res = await fetch(base_url + 'program_required', {
        method: 'PUT',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'job_number': job_number })
    });

    let data = await res.json();

    return data
}

// Query API for data on each job currently in the queue
async function get_json(job_number) {

    let res = await fetch(base_url + 'program_required?job_number=' + job_number, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });

    let data = await res.json();

    return data
}

// Query API for number of jobs currently in the queue
async function get_job_qty() {

    let res = await fetch(base_url + 'get_job_qty', {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });

    let data = await res.json();

    return data
}

var jobs = [...document.querySelectorAll('.btn-block')]

// Event listener to update database and html on click of button
jobs.forEach(function (item) {
    item.addEventListener('click', async function () {
        let res = await put_json(item.id)
        if (res['program_required'] === true) {
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


// Update other clients for changes to 'program_required' field
jobs.forEach(function (item) {
    var x = setInterval(async function () {
        let res = await get_json(item.id)
        if (res['program_required'] === true) {
            item.innerHTML = "Yes";
            item.classList.remove('btn-success');
            item.classList.add('btn-danger');
        }
        else if (res['program_required'] === false) {
            item.innerHTML = "No";
            item.classList.remove('btn-danger');
            item.classList.add('btn-success');
        }
    }, 5000);
});

// Reload page if number of jobs in db is different than number of jobs in client
var x = setInterval(async function () {
    let res = await get_job_qty()
    if (res['job_qty'] !== jobs.length) {
        window.location.reload();
    }
}, 5000);