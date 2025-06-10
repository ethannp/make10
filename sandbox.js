let actualnum = parseInt(new URLSearchParams(window.location.search).get("num"));
sandbox = true;
let SCALE;
if (window.innerWidth < 400) {
    SCALE = 3;
} else {
    SCALE = 4;
}
let queryLink = [];
try {
    queryLink = (new URLSearchParams(window.location.search).get("query")).split("_").map(a => a.replace(/a/g, '+').replace(/s/g, '-').replace(/m/g, '*').replace(/d/g, '/').replace(/e/g, '^').replace(/l/g, '(').replace(/r/g, ')').replace(/p/g, '.').replace(/f/g, '!').replace(/[^-+*/().!\^]/g, ""));
} catch (e) { }
let num = '0000';
if (isNaN(actualnum) || actualnum == undefined || actualnum == null || actualnum < 0 || actualnum > 9999) {
    actualnum = 0;
}
actualnum = String(actualnum).padStart(4, '0');

document.getElementById("all").innerHTML += `<div class="temp" id="make-${num}"></div>`
makeFrame(num);

document.getElementById("all").innerHTML += `<a class='space' id='linktopuz'>🧩puzzle</a><a class='space'>&nbsp;|&nbsp;</a><a class='space' href="all.html">🗃️all puzzles</a>`;
document.getElementById("all").innerHTML += `<div id="canvascontainer">
                <canvas id="allselector" width="${SCALE * 100}" height="${SCALE * 100}"></canvas></div>`;

for (let i = 1; i < 5; i++) {
    document.getElementById(`box-n${i}`).value = actualnum[i - 1];
}
updateNumsSandbox();

for (let i = 1; i <= 5; i++) {
    document.getElementById(`i${i}-0000`).value = queryLink[i - 1];
    document.getElementById(`i${i}-0000`).dispatchEvent(new Event('input', { bubbles: true }))
}

function updateNumsSandbox() {
    for (let i = 1; i < 5; i++) {
        let b = document.getElementById(`box-n${i}`).value;
        if (!multivars[i - 1]) {
            if (b == '') {
                b = '0';
            }
            document.getElementById(`n${i}-0000`).textContent = b;
        }

    }
    calc('0000');
}

document.addEventListener('input', event => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.matches('.sandbox-num')) {
        target.value = target.value.replace(/[^0-9]/g, "");
        multivars[target.getAttribute("data-index") - 1] = false;
        updateMultinum(document.getElementById(`n${target.getAttribute("data-index")}-0000`), target.getAttribute("data-index") - 1);
        updateNumsSandbox();
    }
});

Array.from(document.querySelectorAll('.up')).forEach(input => {
    input.addEventListener("click", function () {
        let box = document.getElementById(`box-n${input.getAttribute("data-index")}`);
        if (parseInt(box.value) == 9) {
            box.value = 0;
        } else {
            box.value = parseInt(box.value) + 1;
        }
        box.dispatchEvent(new Event('input', { bubbles: true }))
    })
});

Array.from(document.querySelectorAll('.down')).forEach(input => {
    input.addEventListener("click", function () {
        let box = document.getElementById(`box-n${input.getAttribute("data-index")}`);
        if (parseInt(box.value) == 0) {
            box.value = 9;
        } else {
            box.value = parseInt(box.value) - 1;
        }
        box.dispatchEvent(new Event('input', { bubbles: true }))
    })
});

let canvas = document.getElementById("allselector")
let ctx = canvas.getContext('2d');


function drawCanvas() {
    refetchCompleted();
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
        return;
    }
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
})
canvas.addEventListener('click', function (ev) {
    x = Math.floor(ev.clientX - canvas.getBoundingClientRect().left);
    y = Math.floor(ev.clientY - canvas.getBoundingClientRect().top);
    let id = Math.floor(y / 4) * 100 + Math.floor(x / 4);
    if (id <= 0) {
        return;
    }
    let a = document.createElement("a");
    a.href = `sandbox.html?num=${id}&query=${getSandboxLink()}`
    a.click();
})

try {
    if (localStorage.getItem("make10-prefs")[6] == '1') {
        enableMultisolve();
    }
}
catch (e) { }