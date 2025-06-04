let num = parseInt(new URLSearchParams(window.location.search).get("num"));
if(isNaN(num) || num == undefined || num == null || num < 0 || num > 9999) {
    window.location.replace("404.html")
}
num = String(num).padStart(4, '0');
let completed;
try { completed = localStorage.getItem("make10-complete").split(",") }
catch (e) {
    completed = [];
}
document.title = "make10 | puzzle " + num + (completed.includes(num) ? "✅": "");
document.getElementById("title").textContent = "puzzle " + num + (completed.includes(num) ? "✅": "");
document.getElementById("all").innerHTML += `<div class="temp" id="make-${num}"></div>`
makeFrame(num);

document.getElementById("all").innerHTML += `<a class='space' href="puzzle.html?num=${Math.floor(Math.random() * 10000)}">🎲random puzzle</a><br/>`
document.getElementById("all").innerHTML += `<a class='space' href="all.html">all puzzles</a><br/>`
document.getElementById("all").innerHTML += `<a class='space' href="index.html">how to play?</a>`