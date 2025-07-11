document.getElementById("export").addEventListener("click", () => {
    refetchCompleted();
    let canvas = document.createElement("canvas");
    canvas.width = 100;
    canvas.height = 101;
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 100, 101);

    let g = 0;
    let b = 0;
    completed.forEach(n => {
        if (challengecompleted.includes(n)) {
            ctx.fillStyle = `rgb(200, ${g}, ${b})`;
        } else {
            ctx.fillStyle = `rgb(100, ${g}, ${b})`;
        }

        ctx.fillRect((n % 100), (Math.floor(n / 100)), 1, 1);
        g++;
        if (g == 256) {
            b++;
            g = 0
        }
    })
    ctx.fillStyle = 'black';
    let prefs = localStorage.getItem("make10-prefs").split("");
    for (const i in prefs) {
        if (prefs[i] == '1') {
            ctx.fillRect(i, 100, 1, 1);
        }
    }
    let link = document.createElement('a');
    link.download = `make10data_${Date.now().toString()}_${completed.length}.png`;
    link.href = canvas.toDataURL('image/png')
    link.click();
})

document.getElementById("import").addEventListener("click", () => {
    refetchCompleted();
    let importfile = document.getElementById("file-upload");
    if (!importfile.files || !importfile.files[0]) {
        showEphemeralMessage(`❌no file selected!`, true, "failure", 6000)
        return;
    }
    const fr = new FileReader();
    let canvas = document.createElement("canvas");
    canvas.width = 100;
    canvas.height = 101;
    let ctx = canvas.getContext('2d');
    fr.addEventListener("load", (e) => {
        const img = new Image();
        img.addEventListener("load", () => {
            if (img.width != 100 || img.height != 101) {
                console.log("incorrect image size");
                showEphemeralMessage(`❌invalid save file!`, true, "failure", 6000)
                return;
            }
            ctx.drawImage(img, 0, 0);
            let imagedata = ctx.getImageData(0, 0, 100, 101).data;
            // 40000 solve data, 40400
            let importsolved = [];
            let importchallengesolved = [];
            let importprefs = [];
            for (let i = 0; i < 40000; i += 4) {
                // 100 = solve
                // 200 = challenge
                if (imagedata[i] == 100) {
                    importsolved.push({ puz: String(i / 4).padStart(4, '0'), order: imagedata[i + 1] + imagedata[i + 2] * 256 });
                }
                else if (imagedata[i] == 200) {
                    importsolved.push({ puz: String(i / 4).padStart(4, '0'), order: imagedata[i + 1] + imagedata[i + 2] * 256 });
                    importchallengesolved.push(String(i / 4).padStart(4, '0'));
                }
                importsolved.sort((a, b) => { return a.order - b.order });
            }
            for (let i = 40000; i < 40400; i += 4) {
                // 255 = 0
                // 0 = 1
                importprefs.push(imagedata[i] == 255 ? 0 : 1);
            }
            // console.log(importsolved);

            if (new Set(importsolved.map(a => a.order)).size != importsolved.length ||
                new Set(importsolved.map(a => a.puz)).size != importsolved.length) {
                //console.log(new Set(importsolved.map(a => a.order)).size);
                console.log("duplicate found");
                showEphemeralMessage(`❌invalid save file!`, true, "failure", 6000)
                return;
            }

            /*console.log(importchallengesolved.join(","));
            console.log(importsolved.map(a => a.puz).join(","));
            console.log(importprefs.slice(0, DEFAULT_SETTINGS.length).join(""));*/

            let newcompleted = completed.slice();
            importsolved.map(a => a.puz).forEach(b => {
                if (!newcompleted.includes(b)) {
                    newcompleted.push(b);
                }
            });
            let newchallengecompleted = challengecompleted.slice();
            importchallengesolved.forEach(b => {
                if (!newchallengecompleted.includes(b)) {
                    newchallengecompleted.push(b);
                }
            })
            console.log(newchallengecompleted);
            console.log(challengecompleted);
            let option = prompt(`OVERWRITE: delete previous data and import ${importsolved.length} solves and ${importchallengesolved.length} challenge solves.
MERGE: add ${newcompleted.length - completed.length} new solves and ${newchallengecompleted.length - challengecompleted.length} new challenge solves.

would you like to OVERWRITE data or MERGE data?`).toUpperCase();

            if (option == "OVERWRITE") {
                localStorage.setItem("make10-complete", importsolved.map(a => a.puz).join(","));
                showEphemeralMessage(`✅${importsolved.length} solves imported!`, true, "success", 10000);
                localStorage.setItem("make10-challengecomplete", importchallengesolved.join(","));
                showEphemeralMessage(`✅${importchallengesolved.length} challenge solves imported!`, true, "success", 10000)
                localStorage.setItem("make10-prefs", importprefs.slice(0, DEFAULT_SETTINGS.length).join(""));
                showEphemeralMessage(`✅settings imported!`, true, "success", 10000)
            } else if (option == "MERGE") {
                if (newcompleted.length - completed.length == 0 && newchallengecompleted.length - challengecompleted.length == 0) {
                    showEphemeralMessage(`no new solves to merge; no data was changed`, true, "default", 6000);
                    return;
                }
                if (newcompleted.length - completed.length != 0) {
                    localStorage.setItem("make10-complete", newcompleted.join(","));
                    showEphemeralMessage(`✅merged ${newcompleted.length - completed.length} new solves!`, true, "success", 10000);
                }
                if (newchallengecompleted.length - challengecompleted.length != 0) {
                    localStorage.setItem("make10-challengecomplete", newchallengecompleted.join(","));
                    showEphemeralMessage(`✅${newchallengecompleted.length - challengecompleted.length} challenge solves imported!`, true, "success", 10000)
                }
                localStorage.setItem("make10-prefs", importprefs.slice(0, DEFAULT_SETTINGS.length).join(""));
                showEphemeralMessage(`✅settings imported!`, true, "success", 10000)
            } else {
                showEphemeralMessage("import canceled; no data was changed.", true, "default", 6000)
            }
        });
        img.src = e.target.result;
    });
    fr.readAsDataURL(importfile.files[0]);
});

document.getElementById("clearall").addEventListener("click", () => {
    if (prompt(`are you sure you want to reset ALL progress? this operation cannot be reversed! please make a backup of your data before proceeding. \ntype RESET to confirm.`) === "RESET") {
        localStorage.removeItem("make10-complete");
        localStorage.removeItem("make10-challengecomplete");
        localStorage.removeItem("make10-prefs");
        showEphemeralMessage(`✅all data was reset!`, true, "success", 10000)

    } else {
        showEphemeralMessage("no data was changed.", true, "default", 6000)
    }
});

let generatedAnimation = false;
let data_url = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
let encoder;
let SCALE = 3;
document.getElementById("size").value = SCALE;

document.getElementById("animationresult").width = 100 * SCALE;
document.getElementById("animationresult").height = 100 * SCALE;
document.getElementById("size").addEventListener("change", () => {
    SCALE = document.getElementById("size").value;
    document.getElementById("animationresult").width = 100 * SCALE;
    document.getElementById("animationresult").height = 100 * SCALE;
})

function createAnimation() {
    refetchCompleted();
    let canvas = document.createElement("canvas");
    let smoothness = 10 - document.getElementById("smoothness").value;

    canvas.width = SCALE * 100;
    canvas.height = SCALE * 100;
    let ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, SCALE * 100, SCALE * 100);
    encoder = new GIFEncoder();
    encoder.setDelay(20);
    encoder.start();
    encoder.addFrame(ctx);
    let addframe = 0;
    ctx.fillStyle = '#02d91f';
    completed.forEach(n => {
        ctx.fillRect((n % 100) * SCALE, (Math.floor(n / 100)) * SCALE, SCALE, SCALE);
        addframe++;
        if (addframe == smoothness) {
            encoder.addFrame(ctx);
            addframe = 0;
        }
    });
    encoder.addFrame(ctx);
    encoder.finish();
    let binary_gif = encoder.stream().getData();
    data_url = 'data:image/gif;base64,' + encode64(binary_gif);
    generatedAnimation = true;
    document.getElementById("progress").textContent = "";
    document.getElementById("animation").style.display = 'inline-block';
    document.getElementById("replay").style.display = 'inline-block';
    document.getElementById("dlanimation").style.display = 'inline-block';
    document.getElementById("animationresult").src = data_url;
    document.getElementById("dlanimation").textContent = `download gif (~${Math.round((data_url.substring(data_url.indexOf(',') + 1).length * 6 / 8) / (1000 * 1000) * 10) / 10} mb)`
}

document.getElementById("animation").addEventListener("click", () => {
    document.getElementById("animation").style.display = 'none';
    document.getElementById("progress").textContent = "loading...";
    setTimeout(() => {
        createAnimation();
    }, 50);
});

document.getElementById("replay").addEventListener("click", () => {
    document.getElementById("animationresult").src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
    setTimeout(() => {
        document.getElementById("animationresult").src = data_url;
    }, 0);
})


document.getElementById("dlanimation").addEventListener("click", () => {
    encoder.download(`make10_${completed.length}.gif`);
})