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

document.getElementById("all").innerHTML += `<button class='btn' id='erase'>🧼erase input</button><br/>
<a class='space' id='linktopuz'>🧩puzzle</a><a class='space'>&nbsp;|&nbsp;</a><a class='space' href="all.html">🗃️all puzzles</a>`;
document.getElementById("all").innerHTML += `<div id="canvascontainer">
<p id='canvaslabel'><b>3938</b> solves</p>
<canvas id="allselector" width="${SCALE * 100}" height="${SCALE * 100}"></canvas></div>
<details style='margin-bottom: 20px'>
    <summary>settings</summary>
    <div class="settingsmenu">
        <label for="cmultisolve"><input type="checkbox" id="cmultisolve">multisolve mode</label>
        <p style="color: grey; margin-top: 0">multisolve mode allows you to solve multiple puzzles at once. click a number to toggle it to 'variable' mode. then, puzzles will only be solved if all queries with <i>every</i> number [0-9] filling <i>every</i> variable evaluates to 10.</p>
    </div>
</details>`;

for (let i = 1; i < 5; i++) {
    document.getElementById(`box-n${i}`).value = actualnum[i - 1];
}
updateNumsSandbox();

for (let i = 1; i <= 5; i++) {
    document.getElementById(`i${i}-0000`).value = queryLink[i - 1];
    document.getElementById(`i${i}-0000`).dispatchEvent(new Event('input', { bubbles: true }))
}

document.getElementById("erase").addEventListener("click", () => {
    for (let i = 1; i <= 5; i++) {
        document.getElementById(`i${i}-0000`).value = "";
        document.getElementById(`i${i}-0000`).dispatchEvent(new Event('input', { bubbles: true }))
    }
})

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
        drawCanvas();
    }
});

Array.from(document.querySelectorAll('.up')).forEach(input => {
    input.addEventListener("click", function () {
        let box = document.getElementById(`box-n${input.getAttribute("data-index")}`);
        if (box.value == "") {
            box.value = 0;
        }
        if (parseInt(box.value) == 9) {
            box.value = 0;
        } else {
            box.value = parseInt(box.value) + 1;
        }
        box.dispatchEvent(new Event('input', { bubbles: true }));
        drawCanvas();
    })
});

Array.from(document.querySelectorAll('.down')).forEach(input => {
    input.addEventListener("click", function () {
        let box = document.getElementById(`box-n${input.getAttribute("data-index")}`);
        if (box.value == "") {
            box.value = 0;
        }
        if (parseInt(box.value) == 0) {
            box.value = 9;
        } else {
            box.value = parseInt(box.value) - 1;
        }
        box.dispatchEvent(new Event('input', { bubbles: true }));
        drawCanvas();
    })
});

Array.from(document.querySelectorAll('.sandbox-num')).forEach(input => {
    input.addEventListener("keydown", event => {
        if (event.keyCode == 38 || event.keyCode == 87) {
            if (parseInt(input.value) == 9) {
                input.value = 0;
            } else {
                input.value = parseInt(input.value) + 1;
            }
        }
        else if (event.keyCode == 40 || event.keyCode == 83) {
            if (parseInt(input.value) == 0) {
                input.value = 9;
            } else {
                input.value = parseInt(input.value) - 1;
            }
        } else if (event.keyCode == 65 || event.keyCode == 37) { //left
            if (input.getAttribute("data-index") == 1) {
                document.getElementById("box-n4").focus();
            } else {
                document.getElementById(`box-n${parseInt(input.getAttribute("data-index")) - 1}`).focus();
            }
        }
        else if (event.keyCode == 68 || event.keyCode == 39) { //right
            if (input.getAttribute("data-index") == 4) {
                document.getElementById("box-n1").focus();
            } else {
                document.getElementById(`box-n${parseInt(input.getAttribute("data-index")) + 1}`).focus();
            }
        } else if (48 <= event.keyCode && event.keyCode <= 59) {
            input.value = event.keyCode - 48;
        } else if (event.keyCode == 8) { //backspace
            event.preventDefault();
            input.value = 0;
        }
        if (input.value == "") {
            input.value = 0;
            console.log("changed")
        }
        input.dispatchEvent(new Event('input', { bubbles: true }));
        drawCanvas();
    })
});

let cmultisolve = document.getElementById("cmultisolve");
cmultisolve.addEventListener('change', () => {
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
    if (cmultisolve.checked) {
        prefs[6] = '1';
    } else {
        prefs[6] = '0';
    }
    localStorage.setItem("make10-prefs", prefs.join(""));
    if (cmultisolve.checked) {
        enableMultisolve();
    } else {
        disableMultisolve();
    }
    updateNumsSandbox();
});

try {
    let prefs = localStorage.getItem("make10-prefs");
    if (prefs.length < DEFAULT_SETTINGS.length) {
        prefs.padEnd(DEFAULT_SETTINGS.length, '0');
    }
    if (prefs[5] == "1") {
        cnewrandom.checked = true;
    }
    if (prefs[6] == "1") {
        cmultisolve.click();
    }
}
catch (e) { localStorage.setItem("make10-prefs", DEFAULT_SETTINGS) }

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

    //highlight selected
    let boxes = `${document.getElementById("box-n1").value || "0"}${document.getElementById("box-n2").value || "0"}${document.getElementById("box-n3").value || "0"}${document.getElementById("box-n4").value || "0"}`;
    let c = "";
    for (let i = 1; i < 5; i++) {
        c += document.getElementById("n" + i + "-" + num).textContent;
    }
    generateAllQueries(c).forEach(cur => {
        if (cur == boxes) {
            ctx.fillStyle = 'blue';
        } else {
            ctx.fillStyle = '#7e79db';
        }
        ctx.fillRect((cur % 100) * SCALE, (Math.floor(cur / 100)) * SCALE, SCALE, SCALE);
        ctx.fillStyle = 'white';
        if (completed.includes(cur)) {
            ctx.fillStyle = '#02d91f';
        }
        if (challengecompleted.includes(cur)) {
            ctx.fillStyle = '#ff3be5';
        }
        ctx.fillRect((cur % 100) * SCALE + 1, (Math.floor(cur / 100)) * SCALE + 1, SCALE - 2, SCALE - 2);
    })

    document.getElementById("canvaslabel").innerHTML = `<b>${completed.length}</b> solves`;
}
drawCanvas();

let x, y;
canvas.addEventListener('mousemove', function (ev) {
    drawCanvas();
    x = Math.floor(ev.clientX - canvas.getBoundingClientRect().left);
    y = Math.floor(ev.clientY - canvas.getBoundingClientRect().top);
    let id = Math.floor(y / SCALE) * 100 + Math.floor(x / SCALE);
    let idstring = String(id).padStart(4, '0');
    if (id < 0) {
        document.getElementById("canvaslabel").innerHTML = `<b>${completed.length}</b> solves`;
        return;
    }
    document.getElementById("canvaslabel").innerHTML = `<b>${completed.length}</b> solves | puzzle ${String(id).padStart(4, '0')}`;
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
    let id = Math.floor(y / SCALE) * 100 + Math.floor(x / SCALE);
    if (id < 0) {
        return;
    }
    let a = document.createElement("a");
    a.href = `sandbox.html?num=${String(id).padStart(4, '0')}&query=${getSandboxLink()}`
    a.click();
})

if (!localStorage.getItem("make10-sandboxfirst") || localStorage.getItem("make10-sandboxfirst") < 3) {
    let x = localStorage.getItem("make10-sandboxfirst") | 0;
    localStorage.setItem("make10-sandboxfirst", x + 1);
    showEphemeralMessage(`note: you can use WASD/arrow keys when changing the puzzle number.`, true, "default", 20000);
}