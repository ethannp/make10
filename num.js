let num = parseInt(new URLSearchParams(window.location.search).get("num"));
if (isNaN(num) || num == undefined || num == null || num < 0 || num > 9999) {
    window.location.replace("404.html")
}
num = String(num).padStart(4, '0');
document.title = "make10 | puzzle " + num + (completed.includes(num) ? "✅" : "");
document.getElementById("title").textContent = "puzzle " + num + (completed.includes(num) ? "✅" : "");
document.getElementById("all").innerHTML += `<div class="temp" id="make-${num}"></div>`
makeFrame(num);

const SCALE = 3;

document.getElementById("all").innerHTML += `
<a class='space' id='next'>▶️next</a><a class='space'>&nbsp;|&nbsp;</a><a class='space' id='nextunsolved'>⏩next unsolved</a><a class='space'>&nbsp;|&nbsp;</a><a class='space' id='randompuzzle'>🎲random puzzle</a><a class='space'>&nbsp;|&nbsp;</a><a class='space' href="all.html">🗃️all puzzles</a><br/>
<a class='space' href="index.html">how to play?</a>
<details style='margin-bottom: 20px'>
<summary>settings</summary>
<div class="settingsmenu">
<label for="cnewrandom"><input type="checkbox" id="cnewrandom">random includes solved puzzles</label>
<label for="cmultisolve"><input type="checkbox" id="cmultisolve">multisolve mode</label>
<p style="color: grey; margin-top: 0">multisolve mode allows you to solve multiple puzzles at once. click a number to toggle it to 'variable' mode. then, puzzles will only be solved if all queries with <i>every</i> number [0-9] filling <i>every</i> variable evaluates to 10.</p>
<img id="progress" style="image-rendering: pixelated;"/>
</div>
</details>
`
function updateCanvas() {
    refetchCompleted();
    let canvas = document.createElement("canvas")
    canvas.width = 100 * SCALE;
    canvas.height = 100 * SCALE;
    let ctx = canvas.getContext('2d');
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

    const dataURL = canvas.toDataURL('image/png');
    document.getElementById("progress").src = dataURL;
}
updateCanvas();

if (num == 9999) {
    document.getElementById("next").href = `puzzle.html?num=0000`;
} else {
    document.getElementById("next").href = `puzzle.html?num=${parseInt(num) + 1}`;
}
let nextunsolved = parseInt(num) + 1;
if (nextunsolved == 10000) {
    nextunsolved = 0;
}
while (completed.includes(String(nextunsolved).padStart(4, '0'))) {
    nextunsolved++;
    if (nextunsolved == 10000) {
        nextunsolved = 0;
    }
}
document.getElementById("nextunsolved").href = `puzzle.html?num=${nextunsolved}`;

let cmultisolve = document.getElementById("cmultisolve");
let cnewrandom = document.getElementById("cnewrandom");

function settingsCheckbox() {
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
    if (cnewrandom.checked) {
        prefs[5] = '1';
        document.getElementById("randompuzzle").href = `puzzle.html?num=${Math.floor(Math.random() * 10000)}`;
    } else {
        prefs[5] = '0';
        let uncompleted = [...Array(10000).keys()].map(a => String(a).padStart(4, '0')).filter(a => !completed.includes(a));
        document.getElementById("randompuzzle").href = `puzzle.html?num=${uncompleted[Math.floor(Math.random() * uncompleted.length)]}`;
    }

    if (cmultisolve.checked) {
        prefs[6] = '1';
    } else {
        prefs[6] = '0';
    }

    localStorage.setItem("make10-prefs", prefs.join(""));
}

cnewrandom.addEventListener('change', () => {
    settingsCheckbox();
})

cmultisolve.addEventListener('change', () => {
    settingsCheckbox();
    if (cmultisolve.checked) {
        enableMultisolve();
    } else {
        disableMultisolve();
    }
})

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

settingsCheckbox();