const mexp = new Mexp();

let completed;
try { completed = localStorage.getItem("make10-complete").split(",") }
catch (e) {
    completed = [];
}
let challengecompleted;
try { challengecompleted = localStorage.getItem("make10-challengecomplete").split(",") }
catch (e) {
    challengecompleted = [];
}

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
        <span class="num" id="n1-${num}">${num[0]}</span>
        <div class="resize-container">
            <span class="resize-text" aria-hidden="true"></span>
            <input class="resize-input" id="i2-${num}" maxlength="10" autocomplete="off"/>
        </div>
        <span class="num" id="n2-${num}">${num[1]}</span>
        <div class="resize-container">
            <span class="resize-text" aria-hidden="true"></span>
            <input class="resize-input" id="i3-${num}" maxlength="10" autocomplete="off"/>
        </div>
        <span class="num" id="n3-${num}">${num[2]}</span>
        <div class="resize-container">
            <span class="resize-text" aria-hidden="true"></span>
            <input class="resize-input" id="i4-${num}" maxlength="10" autocomplete="off"/>
        </div>
        <span class="num" id="n4-${num}">${num[3]}</span>
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
    let num = String(n).padStart(4, '0');
    if (!completed.includes(num)) {
        completed.push(num);
        try { document.getElementById("title").innerHTML += "✅" }
        catch (err) { }
    }
    localStorage.setItem("make10-complete", completed.join(","))
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
    /*const intpart = Math.floor(ans);
    const decimal = ans - intpart;
    const decimalstr = decimal.toFixed(20).substring(2);

    const slice = decimalstr.slice(4, decimalstr.length - 1);
    if (slice.length > 0 && [...slice].every(d => d == '9')) {
        //every digit at the end (except last, possibly 8) is a 9, so round up
        return (intpart + Math.ceil(decimal));
    }
    // don't round. truncate and add ... if appropriate*/
    let trunc = ans.times(10000).round().dividedBy(10000);
    return trunc.equals(ans) ? ans : ans.toFixed(4) + "…";
}

function calc(num) {
    let ans = document.getElementById("ans-" + num);
    let query = "";
    for (let i = 1; i < 5; i++) {
        query += document.getElementById("i" + i + "-" + num).value;
        query += document.getElementById("n" + i + "-" + num).textContent;
    }
    query += document.getElementById("i5" + "-" + num).value;
    try {
        let result = mexp.eval(query);
        if (isNaN(result)) {
            throw "nan";
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
        }
        if ((result == 10 || completed.includes(num)) && challenge.some(a => a.puz == num)) {
            const restr = challenge.find(a => a.puz == num).restrictions;
            document.getElementById("challenge").innerHTML = `<b>Challenge</b>: solve without <code>${restr}</code>`
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
        console.log(e.message)
        if (e.message == "explode") {
            ans.innerHTML = "💥"
        }
        else if (e.message == "infinity") {
            ans.textContent = "♾️";
        }
        else {
            ans.textContent = "❓"
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