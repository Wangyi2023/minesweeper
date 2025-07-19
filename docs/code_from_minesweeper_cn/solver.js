// Solver 1
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function reveal_all_positions() {
    while (!check_end()) {
        let y = Math.floor(Math.random() * Y);
        let x = Math.floor(Math.random() * X);

        if (d31[y][x][1] === 0 && d31[y][x][0] === 0) {
            o0o(x, y);
            const delay = Math.floor(Math.random() * 10);
            await sleep(delay);
        }
    }
}
function check_end() {
    for (let i = 0; i < Y; i++) {
        for (let j = 0; j < X; j++) {
            if (d31[i][j][1] === 0 && d31[i][j][0] === 0) {
                return false;
            }
        }
    }
    return true;
}

reveal_all_positions();



// Solver 2
for (let y = 0; y < Y; y++) {
    for (let x = 0; x < X; x++) {
        if (d31[y][x][1] === 0 && d31[y][x][0] === 0) {
            o0o(x, y);
        }
    }
}


