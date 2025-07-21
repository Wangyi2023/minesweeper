// Solver 1
// 已失效，需要更新变量和函数名
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
// 更新于2025年7月21日

// 已更改函数名，并且通过了验证测试
// 用于验证的变量，如果不定义无法通过检测，游戏逻辑会认为不是由玩家用按键调用的打开方格函数
var VER = '1.0';
for (let y = 0; y < v; y++) {
    for (let x = 0; x < m; x++) {
        if (d[y][x][1] === 0) {
            s(x, y);
        }
    }
}


