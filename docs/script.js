// Document Script.js 22.07.2025
// *** Main JS-Code ***
let first_step = true;
let game_over = false;
let start_time = null;
let timer_interval = null;
let game_field = null;
let board = [];
let counter_revealed = 0;
let counter_marked = 0;

let solvable = false;

let cursor_enabled = false;
let cursor_row = 0;
let cursor_column = 0;

let is_solving = false;

function start_game({X, Y, N} = {}) {
    const difficulty = localStorage.getItem('difficulty') || 'high';
    if (!X || !Y || !N) {
        const params = get_difficulty_params(difficulty);
        X = params.size_x;
        Y = params.size_y;
        N = params.number_of_mines;
    }

    first_step = true;
    game_over = false;
    is_solving = false;
    clearInterval(timer_interval);
    start_time = null;

    game_field = new Game_Field({ X: X, Y: Y, N: N });
    board = [];
    counter_revealed = 0;
    counter_marked = 0;

    cursor_row = game_field.X > 8 ? 4 : 0;
    cursor_column = game_field.Y > 8 ? 4 : 0;

    update_game_information();
    update_solvability_information();
    create_board();
    document.getElementById("status-info").textContent = "In Progress";

    document.addEventListener('keydown', handle_keydown);
    updateCursor();
}

function create_board() {
    board = [];
    counter_revealed = 0;
    const board_element = document.getElementById("board");
    board_element.style.gridTemplateRows = `repeat(${game_field.X}, 20px)`;
    board_element.style.gridTemplateColumns = `repeat(${game_field.Y}, 20px)`;
    board_element.innerHTML = "";

    for (let i = 0; i < game_field.X; i++) {
        let row = [];
        for (let j = 0; j < game_field.Y; j++) {
            const cell = {
                is_mine: game_field.board_mines[i][j],
                is_covered: game_field.board_covered[i][j],
                is_marked: false,
                number_of_surrounding_mines: game_field.board_number[i][j],
                element: null,
            };
            row.push(cell);

            const div = document.createElement("div");
            div.className = "cell";
            div.addEventListener("click", () => select_cell(i, j));
            div.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                mark_cell(i, j);
            });
            cell.element = div;
            board_element.appendChild(div);

            if (!cell.is_covered) {
                cell.element.classList.add("revealed");
                cell.element.textContent = cell.number_of_surrounding_mines > 0
                    ? String(cell.number_of_surrounding_mines)
                    : " ";
                counter_revealed++;
            }
        }
        board.push(row);
    }
}

function select_cell(i, j) {
    if (game_over || !board[i][j].is_covered) return;

    if (board[i][j].is_marked) {
        mark_cell(i, j);
        return;
    }

    if (first_step) {
        if (game_field.board_mines[i][j]) {
            start_game();
            select_cell(i, j);
            return;
        }
        start_timer();
        first_step = false;
    }

    if (game_field.board_mines[i][j]) {
        if (!solvable && game_field.algorithm_enabled) {
            if (game_field.reset_game_field(Module.array_to_string([i, j]))) {
                create_board();
            }
        } else {
            const cell = board[i][j];
            cell.element.textContent = " ";
            cell.element.classList.add("mine");
            cell.is_covered = false;
            cell.element.classList.add("revealed");

            game_over = true;
            game_field.reveal_cell(i, j);
            clearInterval(timer_interval);
            document.getElementById("status-info").textContent = "Failed";
            show_end_message(false);
            return;
        }
    }
    reveal_cell(i, j);
    game_field.calculate_complete_module_collection();
    update_solvability_information();
}

function reveal_cell(i, j) {
    if (game_over || !board[i][j].is_covered) return;

    if (first_step) {
        start_timer();
        first_step = false;
    }

    const cell = board[i][j];

    cell.is_covered = false;
    cell.element.classList.add("revealed");
    if (cell.is_marked) {
        cell.is_marked = false;
        cell.element.classList.remove('marked')
    }
    cell.element.textContent = cell.number_of_surrounding_mines > 0
        ? String(cell.number_of_surrounding_mines)
        : " ";

    game_field.reveal_cell(i, j);
    counter_revealed++;

    if (cell.number_of_surrounding_mines === 0) {
        for (let delta_i of [-1, 0, 1]) {
            for (let delta_j of [-1, 0, 1]) {
                const row = i + delta_i;
                const column = j + delta_j;
                if (row >= 0 && row < game_field.X && column >= 0 && column < game_field.Y) {
                    reveal_cell(row, column);
                }
            }
        }
    }

    if (counter_revealed === game_field.X * game_field.Y - game_field.N) {
        game_over = true;
        clearInterval(timer_interval);
        document.getElementById("status-info").textContent = "Completed";
        show_end_message(true);
    }
}

function mark_cell(i, j) {
    if (game_over || !board[i][j].is_covered) return;

    const cell = board[i][j];
    cell.is_marked = !cell.is_marked;

    if (cell.is_marked) {
        cell.element.classList.add("marked");
        counter_marked++;
    } else {
        cell.element.classList.remove("marked");
        counter_marked--;
    }

    update_game_information();
}

function get_difficulty_params(difficulty) {
    switch (difficulty) {
        case 'low':
            return { size_x: 9, size_y: 9, number_of_mines: 10 };
        case 'medium':
            return { size_x: 16, size_y: 16, number_of_mines: 40 };
        case 'high':
            return { size_x: 16, size_y: 30, number_of_mines: 99 };
        case 'fullscreen':
            const cell_size = 22;
            const X = Math.floor((window.innerHeight - 100) / cell_size);
            const Y = Math.floor(window.innerWidth / cell_size);
            const N = Math.floor( X * Y * 0.20625);
            return { size_x: X, size_y: Y, number_of_mines: N };
        default:
            return { size_x: 16, size_y: 30, number_of_mines: 99 };
    }
}



function change_difficulty(difficulty) {
    const params = get_difficulty_params(difficulty);
    localStorage.setItem('difficulty', difficulty);
    start_game({ X : params.size_x, Y : params.size_y, N : params.number_of_mines });
}

function select_difficulty(level) {
    change_difficulty(level);
    document.getElementById('difficulty-menu').style.display = 'none';
}

function select_background(filename) {
    document.documentElement.style.setProperty('--background-url', `url("Background_Collection/${filename}")`);
    localStorage.setItem('background', filename);
    document.getElementById('background-menu').style.display = 'none';
}

function start_timer() {
    start_time = Date.now();

    if (timer_interval) clearInterval(timer_interval);
    timer_interval = setInterval(() => {update_game_information();}, 100);
}

function update_game_information() {
    const time = start_time ? ((Date.now() - start_time) / 1000).toFixed(1) : "0.0";
    document.getElementById('time-info').textContent = `${time} s`;

    document.getElementById('board-info').textContent = `${game_field.X} × ${game_field.Y} / Mines ${game_field.N}`;

    const density = (game_field.N / (game_field.X * game_field.Y) * 100).toFixed(2);
    document.getElementById('density-info').textContent = `${density}%`;

    document.getElementById('marks-info').textContent = counter_marked;
}

function update_solvability_information() {
    if (!game_field.algorithm_enabled || game_over) {
        document.getElementById('solvability-info').textContent = '---';
        return;
    }

    solvable = game_field.solvable();
    document.getElementById('solvability-info').textContent = solvable ? 'true' : 'false';
}

function send_hint() {
    if (!game_field.algorithm_enabled || game_over) {
        return;
    }

    let hint_i = 0;
    let hint_j = 0;
    const selections = game_field.solver();
    if (selections.size === 0 || first_step) {
        const safe_cells = [];
        for (let i = 0; i < game_field.X; i++) {
            for (let j = 0; j < game_field.Y; j++) {
                if (board[i][j].is_covered && !game_field.board_mines[i][j]) {
                    safe_cells.push([i, j]);
                }
            }
        }
        const random_index = Math.floor(Math.random() * safe_cells.length);
        [hint_i, hint_j] = safe_cells[random_index];
    } else {
        for (const position_str of selections) {
            [hint_i, hint_j] = Module.string_to_array(position_str);
        }
    }

    if (cursor_enabled) {
        [cursor_row, cursor_column] = [hint_i, hint_j];
        updateCursor();
    } else {
        cursor_enabled = true;
        [cursor_row, cursor_column] = [hint_i, hint_j];
        updateCursor();

        setTimeout(() => {
            cursor_enabled = false;
            updateCursor();
        }, 2000);
    }
}

function solve() {
    if (!game_field.algorithm_enabled || game_over) {
        return;
    }

    if (first_step) {
        select_cell(Math.floor(Math.random() * game_field.X), Math.floor(Math.random() * game_field.Y));
        game_field.calculate_complete_module_collection();
        update_solvability_information();
        return;
    }

    const selections = game_field.solver();
    if (selections.size === 0) {
        const safe_cells = [];
        for (let i = 0; i < game_field.X; i++) {
            for (let j = 0; j < game_field.Y; j++) {
                if (board[i][j].is_covered && !game_field.board_mines[i][j]) {
                    safe_cells.push([i, j]);
                }
            }
        }
        const random_index = Math.floor(Math.random() * safe_cells.length);
        const [i, j] = safe_cells[random_index];
        reveal_cell(i, j);
    } else {
        for (const position_str of selections) {
            const position = Module.string_to_array(position_str);
            reveal_cell(position[0], position[1]);
        }
    }
    game_field.calculate_complete_module_collection();
    update_solvability_information();
}

async function solve_all() {
    if (!game_field.algorithm_enabled || game_over) {
        return;
    }
    if (first_step) {
        select_cell(Math.floor(Math.random() * game_field.X), Math.floor(Math.random() * game_field.Y));
        game_field.calculate_complete_module_collection();
        update_solvability_information();
    }
    if (is_solving) {
        is_solving = false;
        return;
    }
    is_solving = true;
    while (!game_over && is_solving) {
        const selections = game_field.solver();
        if (selections.size === 0) {
            const safe_cells = [];
            for (let i = 0; i < game_field.X; i++) {
                for (let j = 0; j < game_field.Y; j++) {
                    if (board[i][j].is_covered && !game_field.board_mines[i][j]) {
                        safe_cells.push([i, j]);
                    }
                }
            }
            const random_index = Math.floor(Math.random() * safe_cells.length);
            const [i, j] = safe_cells[random_index];
            reveal_cell(i, j);
        } else {
            for (const position_str of selections) {
                const position = Module.string_to_array(position_str);
                reveal_cell(position[0], position[1]);
            }
        }
        game_field.calculate_complete_module_collection();
        update_solvability_information();
        await new Promise(resolve => setTimeout(resolve, 200));
    }
}

function auto_mark() {
    if (!game_field.algorithm_enabled) {
        return;
    }
    for (let module of game_field.complete_module_collection) {
        if (module.mines === module.covered_positions.size) {
            for (let position_str of module.covered_positions) {
                const [r, c] = Module.string_to_array(position_str);
                if (!board[r][c].is_marked) {
                    mark_cell(r, c);
                }
            }
        }
    }
}

function activate_algorithm(password) {
    const STORED_HASH = '6db07d30';
    if (hash_x(password) !== STORED_HASH) return;
    game_field.activate_algorithm();
    console.log("Algorithm activated.");
    update_game_information();
    update_solvability_information();
}
function deactivate_algorithm() {
    game_field.deactivate_algorithm();
    console.log("Algorithm deactivated.");
    update_game_information();
    update_solvability_information();
}
function hash_x(input) {
    const str = String(input);
    let hash = 0x811C9DC5;
    for (let i = 0; i < str.length; i++) {
        hash ^= str.charCodeAt(i);
        hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }

    hash ^= 0xDEADBEEF;
    hash = (hash >>> 16) ^ (hash & 0xFFFF);
    hash *= 0xCAFEBABE;
    hash ^= hash >>> 15;
    hash = Math.abs(hash);

    const A = 0x6D2B79F5;
    hash = (hash * A) >>> 0;
    hash ^= (hash >> 5) | (hash << 27);
    hash = (hash * 0x45D9F3B) >>> 0;

    return (hash >>> 0).toString(16).padStart(8, '0');
}


// --- * Cursor * ---
function updateCursor() {
    document.querySelectorAll('.cell').forEach(cell => {
        cell.classList.remove('cursor');
    });

    if (cursor_enabled && board[cursor_row] && board[cursor_row][cursor_column]) {
        board[cursor_row][cursor_column].element.classList.add('cursor');
    }
}

function handle_keydown(event) {
    hide_end_message();
    const key = event.key.toLowerCase();
    if (key === 'escape') {
        hide_guide();
        document.getElementById('difficulty-menu').style.display = 'none';
        document.getElementById('background-menu').style.display = 'none';
        return;
    }

    if (key === 'c') {
        toggle_sidebar();
        return;
    }

    if (key === 'f') {
        cursor_enabled = !cursor_enabled;
        updateCursor();
        return;
    }

    if (!cursor_enabled) return;

    const step = event.shiftKey ? 4 : 1;
    switch (key) {
        case 'w':
        case 'arrowup':
            cursor_row = Math.max(0, cursor_row - step);
            break;
        case 's':
        case 'arrowdown':
            cursor_row = Math.min(game_field.X - 1, cursor_row + step);
            break;
        case 'a':
        case 'arrowleft':
            cursor_column = Math.max(0, cursor_column - step);
            break;
        case 'd':
        case 'arrowright':
            cursor_column = Math.min(game_field.Y - 1, cursor_column + step);
            break;
        case 'h':
            send_hint();
            break;
        case 'm':
            mark_cell(cursor_row, cursor_column);
            break;
        case 'n':
            select_cell(cursor_row, cursor_column);
            break;
        case '0':
            solve();
            break;
        case 'r':
            start_game();
            break;
    }

    updateCursor();
}



// End-Message
function show_end_message(completed) {
    const content = document.getElementById('end-message-content');

    content.innerHTML = '';

    const title = document.createElement('h2');
    title.style.textAlign = 'center';
    title.style.marginBottom = '-5px';
    title.textContent = completed ? 'Congratulations' : 'Failed';

    const message = document.createElement('p');
    message.style.textAlign = 'center';
    message.style.fontSize = '16px';
    message.innerHTML = completed
        ? "You've successfully completed the Minesweeper game.<br> Click anywhere to close this message."
        : "You triggered a mine.<br> Click anywhere to close this message.";

    content.appendChild(title);
    content.appendChild(message);

    document.getElementById('end-message-modal').style.display = 'block';
}

function hide_end_message() {
    document.getElementById('end-message-modal').style.display = 'none';
}


// *** Init ***
start_game();