// CLASS Game_Field
class Game_Field {
    static final_surrounding_positions = [[-1, -1], [-1, 0], [-1, 1], [0, -1],[0, 1], [1, -1], [1, 0], [1, 1]];

    constructor({ X, Y, N, board_mines, board_covered } = {}) {
        this.X = X || 16;
        this.Y = Y || 30;
        this.N = N || 99;

        // Algorithm_Enabled
        this.algorithm_enabled = this.X * this.Y <= 480;

        this.board_mines = board_mines || this.create_empty_board(this.X, this.Y, false);
        this.board_covered = board_covered || this.create_empty_board(this.X, this.Y, true);

        this.add_mines_random(this.N);
        this.board_number = this.calculate_board_number();

        this.complete_module_collection = this.calculate_complete_module_collection();
    }

    activate_algorithm() {
        this.algorithm_enabled = true;
        this.update_complete_module_collection();
    }
    deactivate_algorithm() {
        this.algorithm_enabled = false;
        this.complete_module_collection = new Set();
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

    create_empty_board(X, Y, value = false) {
        const board = [];
        for (let x = 0; x < X; x++) {
            const row = [];
            for (let y = 0; y < Y; y++) {
                row.push(value);
            }
            board.push(row);
        }
        return board;
    }
    create_copy(X, Y, board) {
        const board_copy = []
        for (let x = 0; x < X; x++) {
            const row = [];
            for (let y = 0; y < Y; y++) {
                row.push(board[x][y]);
            }
            board_copy.push(row);
        }
        return board_copy;
    }

    // ALG-2 Reset Game_Field
    reset_game_field(target_position_str) {
        if (!this.algorithm_enabled) {
            return false;
        }

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
            console.log('*** No Linked-Position ***');
            return this.reset_one_position(target_position_str);
        }

        console.log('Remove ' + positions_remove.size + '. ' + positions_remove);
        console.log('Add ' + positions_add.size + '. ' + positions_add);
        for (const position_remove of positions_remove) {
            const position = Module.string_to_array(position_remove);
            this.board_mines[position[0]][position[1]] = false;
        }
        for (const position_add of positions_add) {
            const position = Module.string_to_array(position_add);
            this.board_mines[position[0]][position[1]] = true;
        }
        this.add_mines_partially(positions_remove.size - positions_remove.size);

        this.update_board_number();
        this.update_complete_module_collection();
        return true;
    }
    reset_one_position(target_position_str) {
        const target_position = Module.string_to_array(target_position_str);
        for (let i = 0; i < this.X; i++) {
            for (let j = 0; j < this.Y; j++) {
                if (this.board_mines[i][j] || !this.board_covered[i][j] && !(i === target_position[0] && j === target_position[1])) {
                    continue;
                }

                let valid = true;
                this.board_mines[target_position[0]][target_position[1]] = false;
                this.board_mines[i][j] = true;
                for (let row = 0; row < this.X; row++) {
                    for (let column = 0; column < this.Y; column++) {
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
        if (!this.algorithm_enabled) {
            return new Set;
        }
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
        if (!this.algorithm_enabled) {
            return false;
        }
        for (const module of this.complete_module_collection) {
            if (module.mines === 0) {
                return true;
            }
        }
        return false;
    }

    // Calculator 3
    calculate_complete_module_collection() {
        if (!this.algorithm_enabled) {
            return new Set();
        }

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
        for (let i = 0; i < this.X; i++) {
            for (let j = 0; j < this.Y; j++) {
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
        for (let i = 0; i < this.X; i++) {
            for (let j = 0; j < this.Y; j++) {
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
        for (let i = 0; i < this.X; i++) {
            const row = []
            for (let j = 0; j < this.Y; j++) {
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
            if (row + position[0] >= 0 && row + position[0] < this.X
                && column + position[1] >= 0 && column + position[1] < this.Y) {
                surrounding_cells.push([row + position[0], column + position[1]]);
            }
        }
        return surrounding_cells;
    }

    // Add-Mines
    calculate_number_of_mines() {
        let counter = 0;
        for (let i = 0; i < this.X; i++) {
            for (let j = 0; j < this.Y; j++) {
                counter += this.board_mines[i][j] ? 1 : 0;
            }
        }
        return counter;
    }
    add_mines_random(n) {
        let counter = this.calculate_number_of_mines();
        while (n > 0 && n + counter < this.X * this.Y) {
            const row = Math.floor(Math.random() * this.X);
            const column = Math.floor(Math.random() * this.Y);

            if (!this.board_mines[row][column]) {
                this.board_mines[row][column] = true;
                n--;
            }
        }
    }
    add_mines_partially(n) {
        console.log('Add ' + n + ' Mines partially')
        while (n > 0) {
            this.add_mine_partially();
            n--;
        }
    }
    add_mine_partially() {
    }
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
