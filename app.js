const mexp = new Mexp();

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
    let complete = []
    try { complete = localStorage.getItem("make10-complete").split(","); }
    catch (e) {
        complete = [];
    }
    let num = String(n).padStart(4, '0');
    if (!complete.includes(num)) {
        complete.push(num);
        try { document.getElementById("title").innerHTML += "✅" }
        catch (err) { }
    }
    localStorage.setItem("make10-complete", complete.join(","))
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
        if (result == NaN) {
            throw "nan";
        }
        if (result == "Infinity" || result > 1e15 || result < -1e15) {
            ans.textContent = "♾️";
            return;
        }
        ans.textContent = Math.round(result * 1000) / 1000;
        if (result == 10) {
            ans.textContent = "10✅"
            document.getElementById("frame-" + num).classList.add("complete");
            markComplete(num);
        } else {
            document.getElementById("frame-" + num).classList.remove("complete");
        }
    } catch (e) {
        console.log(e)
        ans.textContent = "❓"
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