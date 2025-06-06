
let list = [...Array(10000).keys()].map(a => String(a).padStart(4, '0'));

const itemWidth = 80;
const itemHeight = 40;
const itemMargin = 8;

const container = document.getElementById('scroll-container');
const content = document.getElementById('content');
function render() {
    const availableWidth = container.clientWidth - 20;
    const fullItemWidth = itemWidth + 2 * itemMargin;
    const columns = Math.floor(availableWidth / fullItemWidth);
    const fullItemHeight = itemHeight + 2 * itemMargin;
    const rows = Math.ceil(list.length / columns);

    content.style.height = `${rows * fullItemHeight}px`;

    const scrollTop = container.scrollTop;
    const containerHeight = container.clientHeight;

    const startRow = Math.floor(scrollTop / fullItemHeight);
    const visibleRows = Math.ceil(containerHeight / fullItemHeight) + 2;

    const rowContentWidth = columns * fullItemWidth;

    content.innerHTML = '';

    for (let row = startRow; row < Math.min(startRow + visibleRows, rows); row++) {
        for (let col = 0; col < columns; col++) {
            const index = row * columns + col;
            if (index >= list.length) continue;
            let num = String(list[index]).padStart(4, '0');
            const span = document.createElement('a');
            span.className = 'puzzle';
            if (challengecompleted.includes(num)) {
                span.classList.add("challengecomplete")
            } else if (completed.includes(num)) {
                span.classList.add("complete");
            }
            span.id = "puz-" + num;
            span.href = `puzzle.html?num=${num}`
            span.style.top = `${row * fullItemHeight + itemMargin}px`;
            span.style.left = `${col * (itemWidth + 2 * itemMargin) + itemMargin}px`;
            span.textContent = (recommendedpuzzles.includes(num) ? "⭐" : "") + `${num}`;
            content.appendChild(span);
        }
    }
}

container.addEventListener('scroll', render);
window.addEventListener('resize', render);

Array.from(document.querySelectorAll('input[type=checkbox]')).forEach(input => {
    input.addEventListener("change", function () {
        checkbox();
    })
});

let hidecompleted = document.getElementById("hidecompleted");
let hideunsolved = document.getElementById("hideunsolved");
let recommended = document.getElementById("recommended");
let haschallenge = document.getElementById("has-challenge");
let random = document.getElementById("random");
let search = document.getElementById("search");
search.addEventListener("input", function () {
    checkbox();
})

try {
    let prefs = localStorage.getItem("make10-prefs");
    if (prefs[0] == "1") {
        hidecompleted.checked = true;
    }
    if (prefs[1] == "1") {
        hideunsolved.checked = true;
    }
    if (prefs[2] == "1") {
        recommended.checked = true;
    }
    if (prefs[3] == "1") {
        random.checked = true;
    }
    if (prefs[4] == "1") {
        haschallenge.checked = true;
    }
}
catch (e) { localStorage.setItem("make10-prefs", DEFAULT_SETTINGS) }

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


function checkbox() {
    list = [...Array(10000).keys()].map(a => String(a).padStart(4, '0'));
    let prefs;
    try {
        prefs = localStorage.getItem("make10-prefs");
        if (prefs.length < DEFAULT_SETTINGS.length) {
            prefs.padEnd(DEFAULT_SETTINGS.length, '0');
        }
    }
    catch (e) {
        prefs = DEFAULT_SETTINGS;
    }
    prefs = prefs.split("");
    search.value = search.value.replace(/[^0-9#]/g, "");
    if (search.value != "") {
        list = list.filter(x => x.match(new RegExp(search.value.replace(/#/g, "[0-9]"), "i")))
    }
    if (hidecompleted.checked) {
        list = list.filter(x => !completed.includes(x));
        prefs[0] = '1';
    } else {
        prefs[0] = '0'
    }
    if (hideunsolved.checked) {
        list = list.filter(x => completed.includes(x));
        prefs[1] = '1';
    } else {
        prefs[1] = '0'
    }
    if (recommended.checked) {
        list = list.filter(x => recommendedpuzzles.includes(x));
        prefs[2] = '1';
    } else {
        prefs[2] = '0'
    }
    if (haschallenge.checked) {
        list = list.filter(x => challenge.some(a => a.puz == x));
        prefs[4] = '1';
    } else {
        prefs[4] = '0'
    }
    if (random.checked) {
        shuffle(list)
        prefs[3] = '1';
    } else {
        prefs[3] = '0'
    }
    localStorage.setItem("make10-prefs", prefs.join(""));
    document.getElementById("completedcount").textContent = "results: " + list.filter(x => completed.includes(x)).length + "/" + list.length;
    render();
}

checkbox();

const SCALE = 4;
let canvas = document.getElementById("allselector")
let ctx = canvas.getContext('2d');


function drawCanvas() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 100 * SCALE, 100 * SCALE);
    ctx.fillStyle = '#02d91f';
    completed.forEach(n => {
        ctx.fillRect((n % 100) * SCALE, (Math.floor(n / 100)) * SCALE, SCALE, SCALE);
    })
    ctx.fillStyle = '#ff3be5';
    challengecompleted.forEach(n => {
        ctx.fillRect((n % 100) * SCALE, (Math.floor(n / 100)) * SCALE, SCALE, SCALE);
    });
}
drawCanvas();

let x, y;
canvas.addEventListener('mousemove', function (ev) {
    drawCanvas();
    x = Math.floor(ev.clientX - canvas.getBoundingClientRect().left);
    y = Math.floor(ev.clientY - canvas.getBoundingClientRect().top);
    let id = Math.floor(y / SCALE) * 100 + Math.floor(x / SCALE);
    let idstring = String(id).padStart(4, '0');
    if (id <= 0) {
        document.getElementById("canvaslabel").innerHTML = `hover below!`
        return;
    }
    document.getElementById("canvaslabel").innerHTML = `go to puzzle ${id} ${completed.includes(idstring) ? (challengecompleted.includes(idstring) ? "✅✅" : "✅") : ""}`;
    ctx.fillStyle = 'black'
    ctx.fillRect(Math.floor(x / SCALE) * SCALE, Math.floor(y / SCALE) * SCALE, SCALE, SCALE);
    if (challengecompleted.includes(idstring)) {
        ctx.fillStyle = '#ff3be5';
    } else if (completed.includes(idstring)) {
        ctx.fillStyle = '#02d91f';
    } else {
        ctx.fillStyle = 'white';
    }
    ctx.fillRect(Math.floor(x / SCALE) * SCALE + 1, Math.floor(y / SCALE) * SCALE + 1, SCALE - 2, SCALE - 2);
})
canvas.addEventListener('mouseleave', function (ev) {
    drawCanvas();
    document.getElementById("canvaslabel").innerHTML = `hover below!`
})
canvas.addEventListener('click', function (ev) {
    x = Math.floor(ev.clientX - canvas.getBoundingClientRect().left);
    y = Math.floor(ev.clientY - canvas.getBoundingClientRect().top);
    let id = Math.floor(y / 4) * 100 + Math.floor(x / 4);
    if (id <= 0) {
        return;
    }
    let a = document.createElement("a");
    a.href = `puzzle.html?num=${id}`
    a.click();
})