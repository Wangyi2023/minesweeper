// script.js - 02.08.2025

// < Part 0 - Define Global-Variables >

let current_difficulty = 'high';
let cell_size = 24;

let first_step = true;
let game_over = false;
let start_time = null;
let last_notice_time = null;
let timer_interval = null;
let game_field = null;
let board = [];
let counter_revealed = 0;
let counter_marked = 0;

let solvable = false;
let is_solving = false;

let cursor_enabled = false;
let cursor_row = 0;
let cursor_column = 0;

let queue = [];
let game_id = 0;
const delay = 0;


// < Part 1 - Game Logic >

// Todo 1.1 - Init
function start_game({X, Y, N} = {}) {
    game_id++;
    queue.length = 0;

    if (!X || !Y || !N) {
        const params = get_difficulty_params(current_difficulty);
        X = params.size_x;
        Y = params.size_y;
        N = params.number_of_mines;
    }

    first_step = true;
    game_over = false;
    is_solving = false;

    game_field = new Game_Field({ X: X, Y: Y, N: N });
    board = [];
    counter_revealed = 0;
    counter_marked = 0;

    cursor_row = game_field.X > 8 ? 4 : 0;
    cursor_column = game_field.Y > 8 ? 4 : 0;

    update_game_information();
    update_solvability_information();
    create_board();

    start_time = null
    last_notice_time = 0;
    timer_interval = null;

    document.getElementById("status-info").textContent = "Ready to start";
    document.getElementById("time-info").textContent = "---";
    render_border();
    updateCursor();
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
            const X = Math.floor((window.innerHeight - 100) / (cell_size + 2));
            const Y = Math.floor((window.innerWidth - 20) / (cell_size + 2));
            const N = Math.floor( X * Y * 0.20625);
            return { size_x: X, size_y: Y, number_of_mines: N };
        default:
            return { size_x: 16, size_y: 30, number_of_mines: 99 };
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
// Todo 1.2 - Edit Main Field
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
        start_time = Date.now();
        timer_interval = setInterval(update_timer, 100);
        document.getElementById('status-info').textContent = 'In Progress';
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
            send_notice('failed');
            return;
        }
    }
    queue.push([i, j]);
    if (queue.length === 1) {
        process_queue(game_id);
    }
}
function process_queue(current_id) {
    if (current_id !== game_id) return;
    if (queue.length === 0) return;

    const [x, y] = queue.shift();
    reveal_cell(x, y, current_id);
    game_field.calculate_complete_module_collection();
    update_solvability_information();

    if (queue.length > 0) {
        setTimeout(() => process_queue(current_id), delay);
    }
}
function reveal_cell(i, j, current_id) {
    if (current_id !== game_id) return;

    if (game_over || !board[i][j].is_covered) return;

    if (first_step) {
        start_time = Date.now();
        timer_interval = setInterval(update_timer, 100);
        document.getElementById('status-info').textContent = 'In Progress';
        first_step = false;
    }

    const cell = board[i][j];
    if (cell.is_marked) {
        mark_cell(i, j);
    }
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
        for (let [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]]) {
            const [x, y] = [i + dx, j + dy]
            if (x >= 0 && x < game_field.X && y >= 0 && y < game_field.Y && game_field.board_covered[x][y]) {
                queue.push([x, y])
            }
        }
    }

    if (counter_revealed === game_field.X * game_field.Y - game_field.N) {
        game_over = true;
        clearInterval(timer_interval);
        document.getElementById("status-info").textContent = "Completed";
        send_notice('congrats');
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
// Todo 1.3 - Algorithm for UI
function solve() {
    is_solving = false;
    if (game_over) {
        return;
    }
    if (!game_field.algorithm_enabled) {
        send_notice('n_enabled')
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
        select_cell(i, j);
    } else {
        for (const position_str of selections) {
            const position = Module.string_to_array(position_str);
            select_cell(position[0], position[1]);
        }
    }
    game_field.calculate_complete_module_collection();
    update_solvability_information();
}
async function solve_all() {
    if (game_over) {
        return;
    }
    if (!game_field.algorithm_enabled) {
        send_notice('n_enabled');
        document.getElementById('solve-all-btn').classList.remove('selected');
        return;
    }
    document.getElementById('solve-all-btn').classList.add('selected');
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
            select_cell(i, j);
        } else {
            for (const position_str of selections) {
                const position = Module.string_to_array(position_str);
                select_cell(position[0], position[1]);
            }
        }
        game_field.calculate_complete_module_collection();
        update_solvability_information();
        await new Promise(resolve => setTimeout(resolve, 200));
    }
    document.getElementById('solve-all-btn').classList.remove('selected');
    is_solving = false;
}
function auto_mark() {
    if (game_over) {
        return;
    }
    if (!game_field.algorithm_enabled) {
        send_notice('n_enabled')
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


// < Part 2 - UI >

// Todo 2.1 - Init
function render_border() {
    const boardWrapper = document.getElementById('board-wrapper');

    document.querySelectorAll('.game-field-border, .game-field-border-outline').forEach(e => e.remove());

    const BORDER_OFFSET = 1;
    const BORDER_OFFSET_OUTLINE = 3;

    const boardWidthPx = game_field.Y * cell_size;
    const boardHeightPx = game_field.X * cell_size;

    const border = document.createElement('div');
    border.classList.add('game-field-border');
    border.style.width = `${boardWidthPx + 2 * BORDER_OFFSET}px`;
    border.style.height = `${boardHeightPx + 2 * BORDER_OFFSET}px`;
    border.style.left = `${-BORDER_OFFSET}px`;
    border.style.top = `${-BORDER_OFFSET}px`;

    const border_outline = document.createElement('div');
    border_outline.classList.add('game-field-border-outline');
    border_outline.style.width = `${boardWidthPx + 2 * BORDER_OFFSET_OUTLINE}px`;
    border_outline.style.height = `${boardHeightPx + 2 * BORDER_OFFSET_OUTLINE}px`;
    border_outline.style.left = `${-BORDER_OFFSET_OUTLINE}px`;
    border_outline.style.top = `${-BORDER_OFFSET_OUTLINE}px`;

    boardWrapper.appendChild(border);
    boardWrapper.appendChild(border_outline);
}
function update_timer() {
    if (start_time) {
        const elapsed = (Date.now() - start_time) / 1000;
        document.getElementById('time-info').textContent = `${elapsed.toFixed(1)} s`;
    }
}
function create_board() {
    board = [];
    counter_revealed = 0;
    const board_element = document.getElementById("board");
    board_element.style.gridTemplateRows = `repeat(${game_field.X}, ${cell_size}px)`;
    board_element.style.gridTemplateColumns = `repeat(${game_field.Y}, ${cell_size}px)`;
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
// Todo 2.2 - Edit Game Status
function select_difficulty(difficulty) {
    current_difficulty = difficulty;
    start_game();
    close_difficulty_menu();
}
function select_background(filename) {
    document.documentElement.style.setProperty('--background-url', `url("Background_Collection/${filename}")`);
    close_background_menu();
}
// Todo 2.3 - Update Game Information
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
// Todo 2.4 - Message / Shortcuts
function send_notice(type, timeout = 4500) {
    const now = Date.now();
    if (now - last_notice_time < 600) { return; }
    last_notice_time = now;

    const container = document.getElementById('notice-container');
    const notice = document.createElement('div');
    const notice_text = document.createElement('div');
    const notice_progress = document.createElement('div');
    notice.classList.add('notice');
    notice_text.classList.add('notice-text');
    notice_progress.classList.add('notice-progress');
    switch (type) {
        case 'congrats':
            notice_text.innerHTML = "Congratulations.<br> You've successfully completed the Minesweeper.";
            notice_progress.style.backgroundColor = 'rgba(0, 220, 80, 1)';
            break;
        case 'failed':
            notice_text.innerHTML = "Failed.<br> You triggered a mine.";
            notice_progress.style.backgroundColor = 'rgba(255, 20, 53, 1)';
            break;
        case 'n_enabled':
            notice_text.innerHTML = "Error.<br> Algorithm was not activated.";
            notice_progress.style.backgroundColor = 'rgba(255, 100, 0, 1)';
            break;
        default:
            notice_text.innerHTML = "Notice.<br> Default Notice Content - 1024 0010 0024.";
            notice_progress.style.backgroundColor = 'rgba(0, 150, 255, 1)';
            break;
    }
    notice_progress.style.animation = `progressShrink ${timeout}ms linear forwards`;
    notice.appendChild(notice_text);
    notice.appendChild(notice_progress);
    notice.onclick = () => {
        if (container.contains(notice)) {
            container.removeChild(notice);
        }
    };
    notice.style.animation = 'slideInRight 0.3s ease forwards';
    container.appendChild(notice);
    setTimeout(() => {
        notice.style.animation = 'fadeOutUp 0.3s ease forwards';
        setTimeout(() => {
            if (container.contains(notice)) {
                container.removeChild(notice);
            }
        }, 300);
    }, timeout);
}
function handle_keydown(event) {
    const key = event.key.toLowerCase();
    if (key === 'escape') {
        hide_guide();
        close_difficulty_menu();
        close_background_menu();
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

    if (key === 'r') {
        start_game();
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
        case ' ':
            select_cell(cursor_row, cursor_column);
            break;
        case '0':
            solve();
            break;
    }

    updateCursor();
}
// Todo 2.5 - Sidebar
function toggle_sidebar() {
    document.body.classList.toggle('sidebar-collapsed');
    localStorage.setItem('sidebarCollapsed', document.body.classList.contains('sidebar-collapsed').toString());

    close_difficulty_menu();
    close_background_menu();
}
function toggle_information() {
    const info_list = document.getElementById('information-list');
    if (info_list.style.display === 'block') {
        info_list.style.display = 'none';
        document.getElementById('information-btn').classList.remove('selected');
    } else {
        info_list.style.display = 'block';
        document.getElementById('information-btn').classList.add('selected');
    }
}
function toggle_difficulty_dropdown() {
    if (document.getElementById('difficulty-menu').style.display === 'none') {
        open_difficulty_menu();
    } else {
        close_difficulty_menu();
    }
    close_background_menu();
}
function toggle_background_dropdown() {
    if (document.getElementById('background-menu').style.display === 'none') {
        open_background_menu();
    } else {
        close_background_menu();
    }
    close_difficulty_menu();
}
function toggle_guide() {
    document.getElementById('guide-modal').style.display = 'block';
}
function hide_guide() {
    document.getElementById('guide-modal').style.display = 'none';
    document.getElementById('guide-btn').classList.remove('selected');
}
function close_guide(event) {
    const modal = document.getElementById('guide-modal');
    const content = modal.querySelector('.modal-content');

    if (!content.contains(event.target)) {
        hide_guide();
    }
}
function open_difficulty_menu() {
    document.getElementById('difficulty-menu').style.display = 'block';
    document.getElementById('difficulty-btn').classList.add('selected');
}
function open_background_menu() {
    document.getElementById('background-menu').style.display = 'block';
    document.getElementById('background-btn').classList.add('selected');
}
function close_difficulty_menu() {
    document.getElementById('difficulty-menu').style.display = 'none';
    document.getElementById('difficulty-btn').classList.remove('selected');
}
function close_background_menu() {
    document.getElementById('background-menu').style.display = 'none';
    document.getElementById('background-btn').classList.remove('selected');
}
// Todo 2.6 - Cursor
function updateCursor() {
    document.querySelectorAll('.cell').forEach(cell => {
        cell.classList.remove('cursor');
    });

    if (cursor_enabled && board[cursor_row] && board[cursor_row][cursor_column]) {
        board[cursor_row][cursor_column].element.classList.add('cursor');
    }
}
function send_hint() {
    if (game_over) {
        return;
    }
    if (!game_field.algorithm_enabled) {
        send_notice('n_enabled');
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



// < Part 3 - Init / Load >

// Todo 3.1 - Init Game / Load Monitor
document.addEventListener('keydown', handle_keydown);
start_game();