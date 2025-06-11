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
    let importfile = document.getElementById("file-upload");
    if (!importfile.files || !importfile.files[0]) {
        alert("please upload an image!");
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
                    importsolved.push({ puz: String(i / 4).padStart(4, '0'), order: imagedata[i + 1] + imagedata[i + 2] * 255 });
                }
                else if (imagedata[i] == 200) {
                    importsolved.push({ puz: String(i / 4).padStart(4, '0'), order: imagedata[i + 1] + imagedata[i + 2] * 255 });
                    importchallengesolved.push(String(i / 4).padStart(4, '0'));
                }
                importsolved.sort((a, b) => { return a.order - b.order });
            }
            for (let i = 40000; i < 40400; i += 4) {
                // 255 = 0
                // 0 = 1
                importprefs.push(imagedata[i] == 255 ? 0 : 1);
            }
            /*console.log(importchallengesolved.join(","));
            console.log(importsolved.map(a => a.puz).join(","));
            console.log(importprefs.slice(0, DEFAULT_SETTINGS.length).join(""));*/

            if (prompt(`importing ${importsolved.length} solves. this will overwrite all current data!\ntype IMPORT to confirm.`) === "IMPORT") {
                localStorage.setItem("make10-complete", importsolved.map(a => a.puz).join(","));
                showEphemeralMessage(`✅${importsolved.length} solves imported!`, true, "success", 10000)
                localStorage.setItem("make10-challengecomplete", importchallengesolved.join(","));
                showEphemeralMessage(`✅${importchallengesolved.length} challenge solves imported!`, true, "success", 10000)
                localStorage.setItem("make10-prefs", importprefs.slice(0, DEFAULT_SETTINGS.length).join(""));
                showEphemeralMessage(`✅settings imported!`, true, "success", 10000)

            } else {
                showEphemeralMessage("import canceled and no data was changed.", true, "default", 6000)
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
})