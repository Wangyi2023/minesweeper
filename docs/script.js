// Document Script.js 14.05.2025
// *** Main JS-Code ***
let first_step = true;
let game_over = false;
let start_time = null;
let timer_interval = null;
let game_field = null;
let board = [];
let counter_revealed = 0;

let solvable = false;

function start_game({s, n} = {}) {
    const difficulty = localStorage.getItem('difficulty') || 'high';
    if (!s || !n) {
        const params = get_difficulty_params(difficulty);
        s = params.size;
        n = params.number_of_mines;
    }

    first_step = true;
    game_over = false;
    clearInterval(timer_interval);
    start_time = null;

    game_field = new Game_Field({ size: s, number_of_mines: n });
    board = [];
    counter_revealed = 0;

    update_game_information();
    update_solvability_information();
    create_board();
    document.getElementById("status-info").textContent = "In Progress";
}

function create_board() {
    board = [];
    counter_revealed = 0;
    const board_element = document.getElementById("board");
    board_element.style.gridTemplateRows = `repeat(${game_field.size[0]}, 20px)`;
    board_element.style.gridTemplateColumns = `repeat(${game_field.size[1]}, 20px)`;
    board_element.innerHTML = "";

    for (let i = 0; i < game_field.size[0]; i++) {
        let row = [];
        for (let j = 0; j < game_field.size[1]; j++) {
            const cell = {
                is_mine: game_field.board_mines[i][j],
                is_covered: game_field.board_covered[i][j],
                number_of_surrounding_mines: game_field.board_number[i][j],
                element: null,
            };
            row.push(cell);
            const div = document.createElement("div");
            div.className = "cell";
            div.addEventListener("click", () => select_cell(i, j));
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

    if (first_step) {
        start_timer();
        first_step = false;
    }

    if (game_field.board_mines[i][j]) {
        if (!solvable) {
            game_field.reset_game_field(Module.array_to_string([i, j]));
            create_board();
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
                if (row >= 0 && row < game_field.size[0] && column >= 0 && column < game_field.size[1]) {
                    reveal_cell(row, column);
                }
            }
        }
    }

    if (counter_revealed === game_field.size[0] * game_field.size[1] - game_field.number_of_mines) {
        game_over = true;
        clearInterval(timer_interval);
        document.getElementById("status-info").textContent = "Completed";
    }
}

function get_difficulty_params(difficulty) {
    switch (difficulty) {
        case 'low': return { size: [9, 9], number_of_mines: 10 };
        case 'medium': return { size: [16, 16], number_of_mines: 40 };
        case 'high': return { size: [16, 30], number_of_mines: 99 };
        case 'fullscreen':
            const cellSize = 22;
            const size = [
                Math.floor((window.innerHeight - 100) / cellSize),
                Math.floor(window.innerWidth / cellSize)
            ];
            return {
                size,
                number_of_mines: Math.floor(size[0] * size[1] * 0.20625)
            };
        default: return { size: [16, 30], number_of_mines: 99 };
    }
}


function change_difficulty(difficulty) {
    const params = get_difficulty_params(difficulty);
    localStorage.setItem('difficulty', difficulty);
    start_game({ s : params.size, n : params.number_of_mines });
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

    document.getElementById('board-info').textContent = `${game_field.size[0]} × ${game_field.size[1]} / Mines ${game_field.number_of_mines}`;

    const density = (game_field.number_of_mines / (game_field.size[0] * game_field.size[1]) * 100).toFixed(2);
    document.getElementById('density-info').textContent = `${density}%`;
}

function update_solvability_information() {
    solvable = game_field.solvable();
    document.getElementById('solvability-info').textContent = solvable ? 'true' : 'false';
}

function solve() {
    if (first_step) {
        select_cell(Math.floor(Math.random() * game_field.size[0]), Math.floor(Math.random() * game_field.size[1]));
        game_field.calculate_complete_module_collection();
        update_solvability_information();
        return;
    }

    const selections = game_field.solver();
    for (const position_str of selections) {
        const position = Module.string_to_array(position_str);
        reveal_cell(position[0], position[1]);
    }
    game_field.calculate_complete_module_collection();
    update_solvability_information();
}

function solve_all() {
    if (first_step) {
        select_cell(Math.floor(Math.random() * game_field.size[0]), Math.floor(Math.random() * game_field.size[1]));
        game_field.calculate_complete_module_collection();
        update_solvability_information();
    }
    while (!game_over) {
        const selections = game_field.solver();
        if (selections.size === 0) {
            break;
        }
        for (const position_str of selections) {
            const position = Module.string_to_array(position_str);
            reveal_cell(position[0], position[1]);
        }
        game_field.calculate_complete_module_collection();
        update_solvability_information();
    }
}




// *** CLASSES ***
// CLASS Game_Field
class Game_Field {
    static final_surrounding_positions = [[-1, -1], [-1, 0], [-1, 1], [0, -1],[0, 1], [1, -1], [1, 0], [1, 1]];

    constructor({ size, number_of_mines, board_mines, board_covered } = {}) {
        this.size = size || [16, 30];
        this.number_of_mines = number_of_mines || 99;

        this.board_mines = board_mines || this.create_empty_board(this.size, false);
        this.board_covered = board_covered || this.create_empty_board(this.size, true);

        this.add_mines_random(this.number_of_mines);
        this.board_number = this.calculate_board_number();

        this.complete_module_collection = this.calculate_complete_module_collection();
    }

    update_board_number() {
        this.board_number = this.calculate_board_number();
    }
    update_complete_module_collection() {
        this.complete_module_collection = this.calculate_complete_module_collection();
    }

    reveal_cell(row, column) {
        this.board_covered[row][column] = false;
    }

    create_empty_board(size, value = false) {
        const board = [];
        for (let i = 0; i < size[0]; i++) {
            const row = [];
            for (let j = 0; j < size[1]; j++) {
                row.push(value);
            }
            board.push(row);
        }
        return board;
    }
    create_copy(size, board) {
        const board_copy = []
        for (let i = 0; i < size[0]; i++) {
            const row = [];
            for (let j = 0; j < size[1]; j++) {
                row.push(board[i][j]);
            }
            board_copy.push(row);
        }
        return board_copy;
    }

    // ALG-2 Reset Game_Field
    reset_game_field(target_position_str) {
        console.log('*** Reset Game-Field ***  ' + target_position_str);
        const filtered_module_collection = [];
        for (const module of this.complete_module_collection) {
            if (module.mines === 1 && module.covered_positions.size === 2) {
                filtered_module_collection.push(module);
            }
        }

        console.log('Test-1 Pass');
        const positions_remove = new Set();
        const positions_add = new Set();

        positions_remove.add(target_position_str);
        let number_of_linked_positions = 0;
        while (number_of_linked_positions < positions_remove.size + positions_add.size) {
            number_of_linked_positions = positions_remove.size + positions_add.size;
            for (const module of filtered_module_collection) {
                for (const position_remove of positions_remove) {
                    if (module.covered_positions.has(position_remove)) {
                        const linked_position_type_add = module.complement(position_remove);
                        positions_add.add(linked_position_type_add);
                    }
                }
            }
            for (const module of filtered_module_collection) {
                for (const position_add of positions_add) {
                    if (module.covered_positions.has(position_add)) {
                        const linked_position_type_remove = module.complement(position_add);
                        positions_remove.add(linked_position_type_remove);
                    }
                }
            }
            console.log(number_of_linked_positions);
        }

        if (positions_add.size === 0) {
            console.log('*** No Linked-Position ***')
            return this.reset_one_position(target_position_str);
        }

        console.log('Remove ' + positions_remove);
        console.log('Add ' + positions_add);
        for (const position_remove of positions_remove) {
            const position = Module.string_to_array(position_remove);
            this.board_mines[position[0]][position[1]] = false;
        }
        for (const position_add of positions_add) {
            const position = Module.string_to_array(position_add);
            this.board_mines[position[0]][position[1]] = true;
        }

        this.update_board_number();
        this.update_complete_module_collection();
        return true;
    }
    reset_one_position(target_position_str) {
        const target_position = Module.string_to_array(target_position_str);
        for (let i = 0; i < this.size[0]; i++) {
            for (let j = 0; j < this.size[1]; j++) {
                if (this.board_mines[i][j] || !this.board_covered[i][j] && !(i === target_position[0] && j === target_position[1])) {
                    continue;
                }

                let valid = true;
                this.board_mines[target_position[0]][target_position[1]] = false;
                this.board_mines[i][j] = true;
                for (let row = 0; row < this.size[0]; row++) {
                    for (let column = 0; column < this.size[1]; column++) {
                        if (!this.board_covered[row][column] && this.board_number[row][column] !== this.calculate_number_of_surrounding_mines(row, column)) {
                            valid = false;
                        }
                    }
                }

                if (!valid) {
                    this.board_mines[target_position[0]][target_position[1]] = true;
                    this.board_mines[i][j] = false;
                } else {
                    this.update_board_number();
                    this.update_complete_module_collection();

                    console.log('--- Reset one Position: ' + target_position_str + ' -> ' + Module.array_to_string([i, j]));
                    return true;
                }
            }
        }
        console.log('*** Reset Failed *** ');
        return false;
    }
    // ALG-1 Solver
    solver() {
        const selection = new Set();
        for (const module of this.complete_module_collection) {
            if (module.mines === 0) {
                for (const position of module.covered_positions) {
                    selection.add(position);
                }
            }
        }
        console.log(selection)
        return selection;
    }
    // ALG-0
    solvable() {
        for (const module of this.complete_module_collection) {
            if (module.mines === 0) {
                return true;
            }
        }
        return false;
    }

    // Calculator 3
    calculate_complete_module_collection() {
        const module_collection = this.calculate_new_modules(this.create_module_collection());
        const inverse_module = this.calculate_inverse_module(module_collection);

        if (inverse_module.covered_positions.size === 0) {
            return module_collection;
        }
        module_collection.push(inverse_module);
        const complete_module_collection = this.calculate_new_modules(module_collection);

        console.log('Size of Complete_module_collection: ' + complete_module_collection.length);
        this.complete_module_collection = complete_module_collection;

        return complete_module_collection;
    }
    // Calculator 2
    create_module_collection() {
        const base_module_collection = [];
        for (let i = 0; i < this.size[0]; i++) {
            for (let j = 0; j < this.size[1]; j++) {
                if (!this.board_covered[i][j] && this.board_number[i][j] > 0) {
                    const module_temp = new Module({
                        mines : this.calculate_number_of_surrounding_mines(i, j),
                        covered_positions : this.calculate_covered_surrounding_positions(i, j)
                    })
                    base_module_collection.push(module_temp);
                }
            }
        }
        return base_module_collection;
    }
    calculate_new_modules(base_module_collection) {
        const new_module_collection = [];
        let counter = 0;
        while (true) {
            new_module_collection.length = 0;
            for (const module_i of base_module_collection) {
                for (const module_j of base_module_collection) {
                    if (module_i.equals(module_j) || !module_i.intersect(module_j)) {
                        continue;
                    }
                    if (module_i.real_subset(module_j)) {
                        const module_0 = new Module({
                            mines : module_j.mines - module_i.mines,
                            covered_positions : Module.difference_set(module_j.covered_positions, module_i.covered_positions) })
                        if (!module_0.contains(base_module_collection) && !module_0.contains(new_module_collection)) {
                            new_module_collection.push(module_0);
                        }
                    } else if (module_i.real_intersect(module_j)
                        && module_j.mines - module_i.mines === Module.difference_set(module_j.covered_positions, module_i.covered_positions).size) {
                        const module_1 = new Module({
                            mines : 0,
                            covered_positions : Module.difference_set(module_i.covered_positions, module_j.covered_positions) })
                        const module_2 = new Module({
                            mines : Module.difference_set(module_j.covered_positions, module_i.covered_positions).size,
                            covered_positions : Module.difference_set(module_j.covered_positions, module_i.covered_positions) });
                        const module_3 = new Module({
                            mines : module_i.mines,
                            covered_positions : Module.intersection_set(module_i.covered_positions, module_j.covered_positions) });
                        if (!module_1.contains(base_module_collection) && !module_1.contains(new_module_collection)) {
                            new_module_collection.push(module_1);
                        }
                        if (!module_2.contains(base_module_collection) && !module_2.contains(new_module_collection)) {
                            new_module_collection.push(module_2);
                        }
                        if (!module_3.contains(base_module_collection) && !module_3.contains(new_module_collection)) {
                            new_module_collection.push(module_3);
                        }
                    }
                }
            }

            for (const module of new_module_collection) {
                if (!module.contains(base_module_collection)) {
                    base_module_collection.push(module);
                }
            }
            if (new_module_collection.length === 0) {
                return base_module_collection;
            }
            counter++;
        }
    }
    calculate_inverse_module(base_module_collection) {
        let inverse_module = new Module({
            mines : this.calculate_number_of_mines(),
            covered_positions : this.calculate_all_covered_positions()
        })
        for (const module of base_module_collection) {
            if (module.real_subset(inverse_module)) {
                inverse_module = new Module({
                    mines: inverse_module.mines - module.mines,
                    covered_positions: Module.difference_set(inverse_module.covered_positions, module.covered_positions)
                });
            }
        }
        return inverse_module;
    }
    // Calculator 1
    calculate_all_covered_positions() {
        const position_collection = new Set();
        for (let i = 0; i < this.size[0]; i++) {
            for (let j = 0; j < this.size[1]; j++) {
                if (this.board_covered[i][j]) {
                    position_collection.add(Module.array_to_string([i, j]));
                }
            }
        }
        return position_collection;
    }
    calculate_covered_surrounding_positions(row, column) {
        const position_collection = new Set();
        for (const position of this.calculate_surrounding_cells(row, column)) {
            if (this.board_covered[position[0]][position[1]]) {
                position_collection.add(Module.array_to_string(position))
            }
        }
        return position_collection;
    }
    // Calculator 0
    calculate_board_number() {
        const board_number = []
        for (let i = 0; i < this.size[0]; i++) {
            const row = []
            for (let j = 0; j < this.size[1]; j++) {
                row.push(this.calculate_number_of_surrounding_mines(i, j))
            }
            board_number.push(row);
        }
        return board_number;
    }
    calculate_number_of_surrounding_mines(row, column) {
        let counter = 0;
        for (const position of this.calculate_surrounding_cells(row, column)) {
            counter += this.board_mines[position[0]][position[1]] ? 1 : 0;
        }
        return counter;
    }
    calculate_surrounding_cells(row, column) {
        const surrounding_cells = [];
        for (const position of Game_Field.final_surrounding_positions) {
            if (row + position[0] >= 0 && row + position[0] < this.size[0]
                && column + position[1] >= 0 && column + position[1] < this.size[1]) {
                surrounding_cells.push([row + position[0], column + position[1]]);
            }
        }
        return surrounding_cells;
    }

    // Add-Mines
    calculate_number_of_mines() {
        let counter = 0;
        for (let i = 0; i < this.size[0]; i++) {
            for (let j = 0; j < this.size[1]; j++) {
                counter += this.board_mines[i][j] ? 1 : 0;
            }
        }
        return counter;
    }
    add_mines_random(n) {
        let counter = this.calculate_number_of_mines();
        while (n > 0 && n + counter < this.size[0] * this.size[1]) {
            const row = Math.floor(Math.random() * this.size[0]);
            const column = Math.floor(Math.random() * this.size[1]);

            if (!this.board_mines[row][column]) {
                this.board_mines[row][column] = true;
                n--;
            }
        }
    }
    add_mines_partially(n) {}
    add_mine_partially() {}
}



// CLASS Module
class Module {
    constructor({ mines, covered_positions } = {}) {
        this.mines = mines;
        this.covered_positions = covered_positions;

        this.id_code = this.calculate_id_code();
    }

    calculate_id_code() {
        const sorted_positions = Array.from(this.covered_positions).sort();
        return `${this.mines}:${sorted_positions.join(',')}`;
    }

    complement(target_position) {
        for (const position of this.covered_positions) {
            if (position !== target_position) {
                return position;
            }
        }
        return null;
    }

    // 0.3 Methoden, die die Relation zwischen zwei Module bestimmen.
    contains(module_collection) {
        for (const module of module_collection) {
            if (this.id_code === module.id_code) {
                return true;
            }
        }
        return false;
    }

    equals(other) {
        return this.id_code === other.id_code;
    }
    subset(other) {
        return Module.subset_set(this.covered_positions, other.covered_positions);
    }
    real_subset(other) {
        return Module.real_subset_set(this.covered_positions, other.covered_positions);
    }
    intersect(other) {
        return Module.intersect_set(this.covered_positions, other.covered_positions);
    }
    real_intersect(other) {
        return Module.real_intersect_set(this.covered_positions, other.covered_positions);
    }

    // 0.2 Methoden, die die Relation zwischen zwei Mengen(Sets) bestimmen.+
    static equals_set(set_i, set_j) {
        if (set_i.size !== set_j.size) {return false;}
        for (const position of set_i) {
            if (!set_j.has(position)) {
                return false;
            }
        }
        return true;
    }
    static subset_set(set_i, set_j) {
        if (set_i.size > set_j.size) {return false;}
        for (const position of set_i) {
            if (!set_j.has(position)) {
                return false;
            }
        }
        return true;
    }
    static real_subset_set(set_i, set_j) {
        if (set_i.size >= set_j.size) {return false;}
        for (const position of set_i) {
            if (!set_j.has(position)) {
                return false;
            }
        }
        return true;
    }
    static intersect_set(set_i, set_j) {
        for (const position of set_i) {
            if (set_j.has(position)) {
                return true;
            }
        }
        return false;
    }
    static real_intersect_set(set_i, set_j) {
        let one_contains = false;
        let one_not_contains = false;

        if (set_i.size < set_j.size) {
            for (const position of set_i) {
                if (set_j.has(position)) {
                    one_contains = true;
                } else {
                    one_not_contains = true;
                }
                if (one_contains && one_not_contains) {
                    return true;
                }
            }
        } else {
            for (const position of set_j) {
                if (set_i.has(position)) {
                    one_contains = true;
                } else {
                    one_not_contains = true;
                }
                if (one_contains && one_not_contains) {
                    return true;
                }
            }
        }
        return false;
    }

    // 0.1 Methoden, die die Relation zwischen zwei Mengen(Sets) berechnen.
    static difference_set(set_i, set_j) {
        const positions_difference = new Set();
        for (const position of set_i) {
            if (!set_j.has(position)) {
                positions_difference.add(position);
            }
        }
        return positions_difference;
    }
    static intersection_set(set_i, set_j) {
        const positions_intersection = new Set();
        for (const position of set_i) {
            if (set_j.has(position)) {
                positions_intersection.add(position);
            }
        }
        return positions_intersection;
    }

    // 0.0 Basis-Methoden, die die Koordinaten zwischen array<integer> und String umwandeln.
    static array_to_string(coordinate_array) {
        return coordinate_array.join(',');
    }
    static string_to_array(coordinate_string) {
        return coordinate_string.split(',').map(Number);
    }

    toString() {
        return this.covered_positions.size < 9 ? `[Module] ${this.mines} / ${this.covered_positions.size} [${[...this.covered_positions].join("  ")}]`
            : `[Module] ${this.mines} / ${this.covered_positions.size}`
    }
}



// *** Init ***
start_game();