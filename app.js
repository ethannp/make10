const mexp = new Mexp();
let multivars = [false, false, false, false];
let sandbox = false;

let completed, challengecompleted;


function refetchCompleted() {
    try { completed = localStorage.getItem("make10-complete").split(",") }
    catch (e) {
        completed = [];
    }
    try { challengecompleted = localStorage.getItem("make10-challengecomplete").split(",") }
    catch (e) {
        challengecompleted = [];
    }
}
refetchCompleted();

function makeFrame(n) {
    let num = String(n).padStart(4, '0');
    let frame = document.getElementById("make-" + num);
    if (typeof (frame) == 'undefined' || frame == null) {
        return;
    }
    frame.innerHTML = `
    <div class="frame" id="frame-${num}">
        <div class="resize-container">
            <span class="resize-text" aria-hidden="true"></span>
            <input class="resize-input" id="i1-${num}" maxlength="10" autocomplete="off"/>
        </div>
        <span class="num" data-index='0' id="n1-${num}">${num[0]}</span>
        <div class="resize-container">
            <span class="resize-text" aria-hidden="true"></span>
            <input class="resize-input" id="i2-${num}" maxlength="10" autocomplete="off"/>
        </div>
        <span class="num" data-index='1' id="n2-${num}">${num[1]}</span>
        <div class="resize-container">
            <span class="resize-text" aria-hidden="true"></span>
            <input class="resize-input" id="i3-${num}" maxlength="10" autocomplete="off"/>
        </div>
        <span class="num" data-index='2' id="n3-${num}">${num[2]}</span>
        <div class="resize-container">
            <span class="resize-text" aria-hidden="true"></span>
            <input class="resize-input" id="i4-${num}" maxlength="10" autocomplete="off"/>
        </div>
        <span class="num" data-index='3' id="n4-${num}">${num[3]}</span>
        <div class="resize-container">
            <span class="resize-text" aria-hidden="true"></span>
            <input class="resize-input" id="i5-${num}" maxlength="10" autocomplete="off"/>
        </div>
        <br />
        <span class="num">=</span><span class="num ans" id="ans-${num}"></span>
    </div>`;
    calc(num);
}

function markComplete(n) {
    refetchCompleted();
    let num = String(n).padStart(4, '0');
    if (!completed.includes(num)) {
        completed.push(num);
        try { document.getElementById("title").innerHTML += "✅" }
        catch (err) { }
        showEphemeralMessage(`✅solved puzzle ${num}`, false, 4000);
    }
    localStorage.setItem("make10-complete", completed.join(","))
    try { updateCanvas(); }
    catch (e) { }
}

function markMultiComplete(ns, num) {
    refetchCompleted();
    let prevCompleted = completed.length;
    if (!completed.includes(num)) {
        //console.log(num);
        try { document.getElementById("title").innerHTML += "✅" }
        catch (err) { }
    }
    completed = [...new Set([...completed, ...ns])];
    localStorage.setItem("make10-complete", completed.join(","))
    if (completed.length != prevCompleted) {
        showEphemeralMessage(`✅multisolved ${completed.length - prevCompleted} puzzles`, false, 4000);
    }
    try { updateCanvas(); }
    catch (e) { }
    try { updateNextUnsolved(); }
    catch (e) { }
}

function markChallengeComplete(n) {
    markComplete(n);
    let num = String(n).padStart(4, '0');
    if (!challengecompleted.includes(num)) {
        challengecompleted.push(num);
        showEphemeralMessage(`✅solved challenge puzzle ${num}`, false, 5000);
    }
    localStorage.setItem("make10-challengecomplete", challengecompleted.join(","))
}

function formatAns(ans) {
    let trunc = ans.times(10000).trunc().dividedBy(10000);
    return trunc.equals(ans) ? ans : ans.toFixed(4) + "…";
}

function updateMultinum(multinum, i) {
    if (multivars[i]) { // variable mode
        multinum.textContent = "#";
        multinum.classList.add("var");
    } else { // number mode
        if (sandbox) {
            multinum.textContent = document.getElementById("box-n" + (i + 1)).value;
        } else {
            multinum.textContent = num[i];
        }
        multinum.classList.remove("var");
    }
}

function handle(e) {
    const multinum = e.target;
    const i = parseInt(multinum.getAttribute("data-index"));
    multivars[i] = !multivars[i];
    updateMultinum(multinum, i);
    calc(num);
}

function enableMultisolve() {
    //console.log("ENABLING MULTI")
    for (let i = 0; i <= 3; i++) {
        let multinum = document.getElementById(`n${i + 1}-${num}`);
        multinum.classList.add("multi");
        multinum.addEventListener("click", handle)
    }
}

function disableMultisolve() {
    //console.log("DISABLING MULTI")
    multivars = [false, false, false, false];
    for (let i = 0; i <= 3; i++) {
        let multinum = document.getElementById(`n${i + 1}-${num}`);
        multinum.classList.remove("multi");
        multinum.textContent = num[i];
        multinum.classList.remove("var");
        multinum.removeEventListener("click", handle);
    }
    calc(num);
}

function generateAllQueries(query) {
    const numvars = multivars.filter(a => a).length;
    if (numvars == 4) {
        throw new Error("multiplevalues");
    }
    const queries = [];
    for (let i = 0; i < Math.pow(10, numvars); i++) {
        const digits = i.toString().padStart(numvars, '0').split('');
        let singlequ = '';
        let digitIndex = 0;
        for (const char of query) {
            if (char == "#") {
                singlequ += digits[digitIndex];
                digitIndex++;
            } else {
                singlequ += char;
            }
        }
        queries.push(singlequ);
    }
    return queries;
}

function getPuzzleInfo(n) {
    for (const g in recommendedpuzzles) {
        const group = recommendedpuzzles[g];
        if (group.puzzles.includes(n)) {
            return { author: group.author, emoji: group.emoji };
        }
    }
    return null;
}

function getSandboxLink() {
    let query = "";
    for (let i = 1; i < 5; i++) {
        query += document.getElementById("i" + i + "-" + num).value;
        query += "#";
    }
    query += document.getElementById("i5" + "-" + num).value;
    query = query.replace(/\+/g, 'a').replace(/\-/g, 's').replace(/\*/g, 'm').replace(/\//g, 'd').replace(/\^/g, 'e').replace(/\(/g, 'l').replace(/\)/g, 'r').replace(/\./g, 'p').replace(/\!/g, 'f').replace(/\#/g, '_');
    return query;
}

function showEphemeralMessage(text, closable, duration = 3000) {
    const ephemeralcontainer = document.getElementById("ephemeralcontainer");
    if (!ephemeralcontainer) {
        console.log("no ephemeral message container");
        return;
    }
    const elt = document.createElement("div");
    elt.classList.add("ephemeral");

    const msg = document.createElement("span");
    msg.textContent = text;
    elt.appendChild(msg);
    const closebtn = document.createElement("span");
    if (closable) {
        closebtn.classList.add("ephemeral-close");
        closebtn.textContent = '×';
        elt.appendChild(closebtn);
        elt.classList.add('closable');
    }
    else {
        elt.classList.add('unclosable');
    }

    ephemeralcontainer.prepend(elt);
    elt.offsetWidth;
    elt.classList.add('show');

    const hidemsg = () => {
        elt.classList.remove('show');
        elt.classList.add('hide');
        const transitionendhandler = () => {
            elt.removeEventListener('transitionend', transitionendhandler);
            if (elt.parentNode) {
                elt.remove();
            }
        };
        elt.addEventListener('transitionend', transitionendhandler);
    };

    const autohide = setTimeout(hidemsg, duration);
    closebtn.addEventListener("click", () => {
        clearTimeout(autohide);
        hidemsg();
    })
}


function calc(num) {
    refetchCompleted();
    try { updateSandboxLink(); }
    catch (e) { }
    let ans = document.getElementById("ans-" + num);
    let query = "";
    for (let i = 1; i < 5; i++) {
        query += document.getElementById("i" + i + "-" + num).value;
        query += document.getElementById("n" + i + "-" + num).textContent;
    }
    query += document.getElementById("i5" + "-" + num).value;
    if (sandbox) {
        window.history.replaceState({}, '', `sandbox.html?num=${document.getElementById("box-n1").value || "0"}${document.getElementById("box-n2").value || "0"}${document.getElementById("box-n3").value || "0"}${document.getElementById("box-n4").value || "0"}&query=${getSandboxLink()}`);
        try {
            document.getElementById("linktopuz").href = `puzzle.html?num=${document.getElementById("box-n1").value || "0"}${document.getElementById("box-n2").value || "0"}${document.getElementById("box-n3").value || "0"}${document.getElementById("box-n4").value || "0"}&query=${getSandboxLink()}`;
            document.getElementById("linktopuz").textContent = `🧩puzzle ${document.getElementById("box-n1").value || "0"}${document.getElementById("box-n2").value || "0"}${document.getElementById("box-n3").value || "0"}${document.getElementById("box-n4").value || "0"}`;
        }
        catch (e) { }
    }
    if (multivars.some(a => a)) { //MULTI ON
        document.getElementById("frame-" + num).classList.remove("complete");
        document.getElementById("frame-" + num).classList.remove("challengecomplete");
        // create all possible queries
        try {
            let queries = generateAllQueries(query);
            //console.log(queries);
            let result = mexp.eval(queries[0]);
            if (isNaN(result)) {
                throw new Error("nan");
            }
            for (let j = 1; j < queries.length; j++) {
                let result2 = mexp.eval(queries[j]);
                if (isNaN(result2)) {
                    throw new Error("nan");
                }
                if (!result.equals(result2)) {
                    throw new Error("multiplevalues");
                }
            }
            ans.textContent = formatAns(result);
            if (result == 10) {
                ans.textContent = "10✅"
                document.getElementById("frame-" + num).classList.add("multicomplete");
                markMultiComplete(queries.map(q => q.replace(/[^0-9]/g, "").padStart(4, '0')), num);
                try { drawCanvas(); }
                catch (e) { }
            } else {
                document.getElementById("frame-" + num).classList.remove("multicomplete");
            }
        }
        catch (err) {
            console.log(err);
            if (err.message == "multiplevalues") {
                ans.textContent = "🌀";
                return;
            }
            else if (err.message == "explode") {
                ans.innerHTML = "💥"
                return;
            }
            else if (err.message == "infinity") {
                ans.textContent = "♾️";
                return;
            }
            else {
                ans.textContent = "❓"
            }
            document.getElementById("frame-" + num).classList.remove("multicomplete");
        }

    } else {
        //MULTI OFF
        document.getElementById("frame-" + num).classList.remove("multicomplete");
        try {
            let result = mexp.eval(query);
            if (isNaN(result)) {
                throw new Error("nan");
            }
            if (result == "Infinity") {
                ans.textContent = "♾️";
                return;
            }
            if (result.abs().greaterThan(new Decimal(1e15))) {
                ans.innerHTML = "💥";
                return;
            }
            ans.textContent = formatAns(result);
            if (result == 10) {
                ans.textContent = "10✅"
                document.getElementById("frame-" + num).classList.add("complete");
                if (sandbox) {
                    markComplete(query.replace(/[^0-9]/g, ""));
                    try { drawCanvas(); }
                    catch (e) { }
                } else {
                    markComplete(num);
                }
            } else {
                document.getElementById("frame-" + num).classList.remove("complete");
                document.getElementById("frame-" + num).classList.remove("challengecomplete");
            }
            if ((result == 10 || completed.includes(num)) && challenge.some(a => a.puz == num) && !sandbox) {
                const restr = challenge.find(a => a.puz == num).restrictions;
                document.getElementById("challenge").innerHTML = `<b>Challenge</b>: solve without <code>${restr}</code>!`
                if (![...restr].some(c => query.includes(c)) && result == 10) {
                    document.getElementById("frame-" + num).classList.remove("complete");
                    document.getElementById("frame-" + num).classList.add("challengecomplete");
                    markChallengeComplete(num);
                }
                if (challengecompleted.includes(num)) {
                    document.getElementById("challenge").innerHTML += "✅";
                }
            }
            if (result == 10 && !sandbox && num == '5095' && mexp.eval(query.replace('9', '8')).equals(10)) {
                document.getElementById("challenge").innerHTML = '[🤖]: notice how the expression would still evaluate to 10 even if the 9 was any other number? try using <b>multisolve mode</b> (enable it under settings)!'
            }
            if (result == 10 && !sandbox && num == '6072' && mexp.eval(query.replace('6', '5')).equals(10)) {
                document.getElementById("challenge").innerHTML = '[🤖]: notice how the expression would still evaluate to 10 even if the 6 was any other number? try using <b>multisolve mode</b> (enable it under settings)!'
            }
        } catch (e) {
            console.log(e)
            if (e.message == "explode") {
                ans.innerHTML = "💥"
            }
            else if (e.message == "infinity") {
                ans.textContent = "♾️";
            }
            else {
                ans.textContent = "❓"
            }
            document.getElementById("frame-" + num).classList.remove("complete");
            document.getElementById("frame-" + num).classList.remove("challengecomplete");
        }
    }
    if (sandbox) {
        if (completed.includes(`${document.getElementById("box-n1").value || "0"}${document.getElementById("box-n2").value || "0"}${document.getElementById("box-n3").value || "0"}${document.getElementById("box-n4").value || "0"}`)) {
            document.getElementById("sandbox-completed").textContent = "✅";
        } else {
            document.getElementById("sandbox-completed").textContent = "";
        }
    }
}

Array.from(document.querySelectorAll('.temp')).forEach(input => {
    makeFrame(input.id.split("-")[1]);
});


document.addEventListener('input', event => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (!target.matches('.resize-input')) return;
    target.value = target.value.replace(/[^-+*/().!\^]/g, "");
    calc(target.id.split("-")[1]);
    target.previousElementSibling.textContent = target.value;
});

Array.from(document.querySelectorAll('.resize-input')).forEach(input => {
    input.previousElementSibling.textContent = input.value;
});