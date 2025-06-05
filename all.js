
let list = [...Array(10000).keys()].map(a => String(a).padStart(4, '0'));
let completed;
try { completed = localStorage.getItem("make10-complete").split(",") }
catch (e) {
    completed = [];
}

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
            if (completed.includes(num)) {
                span.classList.add("complete")
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
let random = document.getElementById("random");
let search = document.getElementById("search");
search.addEventListener("input", function() {
    checkbox();
})

try{
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
}
catch(e) {localStorage.setItem("make10-prefs", "0000")}

let recommendedpuzzles = ['0004', '1111', '1254', '2253', '3451', '3565', '2542', '3332', '4367', '4658', '4851','7072', '7585', '8235']

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}


function checkbox() {
    list = [...Array(10000).keys()].map(a => String(a).padStart(4, '0'));
    let prefs = [0, 0, 0, 0]
    search.value = search.value.replace(/[^0-9#]/g,"");
    if (search.value != "") {
        list = list.filter(x => x.match(new RegExp(search.value.replace(/#/g,"[0-9]"), "i")))
    }
    if (hidecompleted.checked) {
        list = list.filter(x => !completed.includes(x));
        prefs[0] = 1;
    }
    if (hideunsolved.checked) {
        list = list.filter(x => completed.includes(x));
        prefs[1] = 1;
    }
    if (recommended.checked) {
        list = list.filter(x => recommendedpuzzles.includes(x));
        prefs[2] = 1;
    }
    if (random.checked) {
        shuffle(list)
        prefs[3] = 1;
    }
    localStorage.setItem("make10-prefs", prefs.join(""));
    document.getElementById("completedcount").textContent = "Results: " + list.filter(x => completed.includes(x)).length + "/" + list.length;
    render();
}

checkbox();