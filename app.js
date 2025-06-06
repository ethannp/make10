const mexp = new Mexp();
let multivars = [false, false, false, false];

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
    }
    localStorage.setItem("make10-complete", completed.join(","))
    try { updateCanvas(); }
    catch (e) { }
}

function markMultiComplete(ns, num) {
    refetchCompleted();
    if (!completed.includes(num)) {
        //console.log(num);
        try { document.getElementById("title").innerHTML += "✅" }
        catch (err) { }
    }
    completed = [...new Set([...completed, ...ns])];
    localStorage.setItem("make10-complete", completed.join(","))
    try { updateCanvas(); }
    catch (e) { }
}

function markChallengeComplete(n) {
    markComplete(n);
    let num = String(n).padStart(4, '0');
    if (!challengecompleted.includes(num)) {
        challengecompleted.push(num);
    }
    localStorage.setItem("make10-challengecomplete", challengecompleted.join(","))
}

function formatAns(ans) {
    // don't round. truncate and add ... if appropriate*/
    let trunc = ans.times(10000).round().dividedBy(10000);
    return trunc.equals(ans) ? ans : ans.toFixed(4) + "…";
}

function handle(e) {
    const multinum = e.target;
    const i = parseInt(multinum.getAttribute("data-index"));
    multivars[i] = !multivars[i];
    if (multivars[i]) { // variable mode
        multinum.textContent = "#";
        multinum.classList.add("var");
    } else { // number mode
        multinum.textContent = num[i];
        multinum.classList.remove("var");
    }
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


function calc(num) {
    let ans = document.getElementById("ans-" + num);
    let query = "";
    for (let i = 1; i < 5; i++) {
        query += document.getElementById("i" + i + "-" + num).value;
        query += document.getElementById("n" + i + "-" + num).textContent;
    }
    query += document.getElementById("i5" + "-" + num).value;
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
                markComplete(num);
            } else {
                document.getElementById("frame-" + num).classList.remove("complete");
                document.getElementById("frame-" + num).classList.remove("challengecomplete");
            }
            if ((result == 10 || completed.includes(num)) && challenge.some(a => a.puz == num)) {
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