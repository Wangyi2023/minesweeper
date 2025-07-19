package Minesweeper_Java;

import javax.xml.stream.events.StartDocument;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

public class Game_Field {
    private static final String empty = "  ";
    private static final String mine = "\u001B[31m *\u001B[0m";
    private static final String covered = " ■";
    private static final String quad = "        ";
    private static final int[][] final_surrounding_positions = {{-1, -1}, {-1, 0}, {-1, 1}, {0, -1}, {0, 1}, {1, -1}, {1, 0}, {1, 1}};

    protected int[] size;
    protected int number_of_mines;

    protected boolean[][] board_mines;
    protected boolean[][] board_covered;

    // Konstruktor
    public Game_Field(int[] size, int number_of_mines) {
        this.size = size[0] > 0 && size[1] > 0 ? size : new int[]{16, 16};
        this.number_of_mines = Math.max(number_of_mines, 0);

        this.board_mines = Game_Field_Collection.create_empty_board(this.size);
        this.board_covered = Game_Field_Collection.create_empty_board(this.size, true);

        this.add_mines_random(number_of_mines);
    }

    // Konstruktor für board with default size and difficulty
    public Game_Field() {
        this(new int[]{16, 16}, 40);
    }

    // *** Konstruktor für Administrator ***
    public Game_Field(boolean[][] board_mines) {
        this(new int[]{board_mines.length, board_mines[0].length}, 0);
        this.setBoard_mines(board_mines);
    }




    // *** Check Solvability ***
    public boolean solvable() {
        Set<Module> module_collection = calculate_complete_module_collection();
        for (Module module : module_collection) {
            if (module.getMines() == 0) {
                return true;
            }
        }
        return false;
    }
    // Calculator 1
    // Calculate Complete Module-Collection
    public Set<Module> calculate_complete_module_collection() {
        Set<Module> module_collection = calculate_module_collection(creat_module_collection());
        Module inverse = calculate_inverse_module();
        if (inverse.getCovered_positions().length == 0) {
            return module_collection;
        }
        module_collection.add(inverse);
        module_collection = calculate_module_collection(module_collection);
        return module_collection;
    }
    // Calculate Inverse-Module
    public Module calculate_inverse_module() {
        Set<Module> module_collection = calculate_module_collection(creat_module_collection());
        Module inverse = new Module(this);
        for (Module module : module_collection) {
            if (module.subset(inverse)) {
                inverse = new Module(inverse.getMines() - module.getMines(), inverse.difference(module));
            }
        }
        return inverse;
    }
    // Create Module-Collection
    public Set<Module> creat_module_collection() {
        // Creat Module-Collection
        Set<Module> module_collection = new HashSet<>();
        for (int i = 0; i < size[0]; i++) {
            for (int j = 0; j < size[1]; j++) {
                if (!board_covered[i][j] && calculate_number_of_surrounding_mines(i, j) > 0) {

                    ArrayList<int[]> surrounding_covered_cells = new ArrayList<>();
                    for (int[] position : calculate_surrounding_cells(i, j)) {
                        if (getBoard_covered()[position[0]][position[1]]) {
                            surrounding_covered_cells.add(position);
                        }
                    }
                    Module module_surround_ij = new Module(calculate_number_of_surrounding_mines(i, j), surrounding_covered_cells.toArray(new int[0][]));
                    module_collection.add(module_surround_ij);
                }
            }
        }
        return module_collection;
    }
    // Calculate new Modules
    public Set<Module> calculate_module_collection(Set<Module> module_collection) {
        while (true) {
            Set<Module> module_collection_temp = new HashSet<>(module_collection);
            for (Module module_i : module_collection) {
                for (Module module_j : module_collection) {
                    if (module_i.equals(module_j) || !module_i.intersect(module_j)) {
                        continue;
                    }
                    if (module_i.real_subset(module_j)) { // 1.Situation: real-subset
                        Module module_temp = new Module(module_j.getMines() - module_i.getMines(),
                                module_j.difference(module_i));
                        module_collection_temp.add(module_temp);
                    } else if (module_i.real_intersect(module_j)) {  // 2.Situation: real-intersect
                        if (module_j.getMines() - module_i.getMines() == module_j.difference(module_i).length) {
                            module_collection_temp.add(new Module(0, module_i.difference(module_j)));
                            module_collection_temp.add(new Module(module_j.difference(module_i).length, module_j.difference(module_i)));
                            module_collection_temp.add(new Module(module_i.getMines(), module_i.intersection(module_j)));
                        }
                    }
                }
            }
            // Falls kein neues Modul
            if (module_collection_temp.size() == module_collection.size()) {
                break;
            }
            module_collection = module_collection_temp;
        }
        return module_collection;
    }


    // Calculator 0
    // Calculate number of mines
    public int calculate_number_of_mines() {
        int counter = 0;
        for (int i = 0; i < size[0]; i++) {
            for (int j = 0; j < size[1]; j++) {
                counter += board_mines[i][j] ? 1 : 0;
            }
        }
        return counter;
    }

    // Calculate all covered positions
    public int[][] calculate_all_covered_positions() {
        ArrayList<int[]> covered_positions = new ArrayList<>();
        for (int i = 0; i < size[0]; i++) {
            for (int j = 0; j < size[1]; j++) {
                if (board_covered[i][j]) {
                    covered_positions.add(new int[]{i, j});
                }
            }
        }
        return covered_positions.toArray(new int[0][]);
    }

    // Calculate surrounding mines / number of uncovered Position
    public int calculate_number_of_surrounding_mines(int row, int column) {
        int counter = 0;
        for (int[] position : calculate_surrounding_cells(row, column)) {
            counter += board_mines[position[0]][position[1]] ? 1 : 0;
        }
        return counter;
    }
    public static int calculate_number_of_surrounding_mines(boolean[][] board_mines, int row, int colum) {
        Game_Field game_field = new Game_Field(board_mines);
        return game_field.calculate_number_of_surrounding_mines(row, colum);
    }

    // Calculate surrounding cells
    public int[][] calculate_surrounding_cells(int row, int column) {
        ArrayList<int[]> surrounding_cells = new ArrayList<>();
        for (int[] position : final_surrounding_positions) {
            if (row + position[0] >= 0 && row + position[0] < size[0]
                    && column + position[1] >= 0 && column + position[1] < size[1]) {
                surrounding_cells.add(new int[]{row + position[0], column + position[1]});
            }
        }
        return surrounding_cells.toArray(new int[0][]);
    }




    // *** Algorithm - Reset Game-field ***
    public boolean reset_game_field(int[] target_position) {
        if (!board_mines[target_position[0]][target_position[1]]) {
            return true;
        }
        int[] first_linked_position = new int[]{-1, -1};
        for (Module module : calculate_complete_module_collection()) {
            if (module.contains(target_position) && module.getMines() == 1 && module.getCovered_positions().length == 2) {
                first_linked_position = module.difference(new Module(0, new int[][]{target_position}))[0];
                break;
            }
        }
        // Falls keine Linked-Position zu Target-Position
        if (first_linked_position[0] == -1) {
            return reset_one_position(target_position);
        }

        // Creat Copy of board_mines
        boolean[][] board_mines_copy = creat_copy(board_mines);

        ArrayList<int[]> positions = find_linked_positions(target_position);
        ArrayList<int[]> positions_new = find_linked_positions(first_linked_position);

        for (int[] position : positions) {
            board_mines[position[0]][position[1]] = false;
        }
        for (int[] position : positions_new) {
            board_mines[position[0]][position[1]] = true;
        }

        int difference = positions.size() - positions_new.size();
        add_mines_partially(difference);

        if (calculate_number_of_mines() != number_of_mines) {
            setBoard_mines(board_mines_copy);
            return false;
        }
        return true;
    }
    public boolean reset_one_position(int[] target_position) {
        boolean[][] board_mines_copy = creat_copy(board_mines);
        board_mines[target_position[0]][target_position[1]] = false;
        for (int i = 0; i < size[0]; i++) {
            for (int j = 0; j < size[1]; j++) {
                if (!board_covered[i][j] || board_mines[i][j] || (i == target_position[0] && j == target_position[1])) {
                    continue;
                }
                board_mines[i][j] = true;
                if (partially_equal(size, board_covered, board_mines, board_mines_copy)) {
                    return true;
                }
                board_mines[i][j] = false;
            }
        }
        board_mines[target_position[0]][target_position[1]] = true;
        return false;
    }

    // Find linked positions
    public ArrayList<int[]> find_linked_positions(int[] position) {
        ArrayList<int[]> linked_positions = new ArrayList<int[]>(Collections.singletonList(position));

        Set<Module> filtered_module_collection = new HashSet<>();
        for (Module module : calculate_complete_module_collection()) {
            if (module.getMines() == 1 && module.getCovered_positions().length == 2) {
                filtered_module_collection.add(module);
            }
        }
        int number_of_linked_positions;
        while (true) {
            number_of_linked_positions = linked_positions.size();
            linked_positions = find_linked_positions(linked_positions, filtered_module_collection);
            if (number_of_linked_positions == linked_positions.size()) {break;}
        }
        return linked_positions;
    }
    public ArrayList<int[]> find_linked_positions(ArrayList<int[]> positions, Set<Module> filtered_module_collection) {
        ArrayList<int[]> linked_positions = new ArrayList<>(positions);
        for (int[] position : positions) {
            for (Module module_i : filtered_module_collection) {
                if (module_i.contains(position)) {
                    for (Module module_j : filtered_module_collection) {
                        if (module_i.real_intersect(module_j) && !module_j.contains(position)) {
                            int[] target_position = module_j.difference(module_i)[0];
                            boolean contains = false;
                            for (int[] linked_position : linked_positions) {
                                if (target_position[0] == linked_position[0] && target_position[1] == linked_position[1]) {
                                    contains = true;
                                    break;
                                }
                            }
                            if (!contains) {
                                linked_positions.add(target_position);
                            }
                        }
                    }
                }
            }
        }
        return linked_positions;
    }




    public static boolean partially_equal(int[] size, boolean[][] board_covered, boolean[][] board_mines_1, boolean[][] board_mines_2) {
        for (int i = 0; i < size[0]; i++) {
            for (int j = 0; j < size[1]; j++) {
                if (!board_covered[i][j]
                        && Game_Field.calculate_number_of_surrounding_mines(board_mines_1, i, j)
                        != Game_Field.calculate_number_of_surrounding_mines(board_mines_2, i, j)) {
                    return false;
                }
            }
        }
        return true;
    }

    // Add Mines
    public void add_mines_random(int n) {
        int counter = 0;
        for (int i = 0; i < size[0]; i++) {
            for (int j = 0; j < size[1]; j++) {
                counter += board_mines[i][j] ? 1 : 0;
            }
        }
        while (n > 0 && n + counter < size[0] * size[1]) {
            int row = (int) (Math.random() * size[0]);
            int column = (int) (Math.random() * size[1]);

            if (!board_mines[row][column]) {
                board_mines[row][column] = true;
                n--;
            }
        }
    }
    public void add_mines_partially(int n) {
        for (int i = 0; i < n; i++) {
            this.add_mine_partially();
        }
    }
    public void add_mine_partially() {
        boolean[][] board_mines_copy = creat_copy(board_mines);
        for (int i = 0; i < size[0]; i++) {
            for (int j = 0; j < size[1]; j++) {
                if (!board_mines[i][j] && board_covered[i][j]) {
                    board_mines[i][j] = true;
                    if (partially_equal(size, board_covered, board_mines, board_mines_copy)) {
                        return;
                    }
                    board_mines[i][j] = false;
                }
            }
        }
    }

    // Copy Board
    public boolean[][] creat_copy(boolean[][] board) {
        boolean[][] board_copy = new boolean[board.length][board[0].length];
        for (int i = 0; i < board.length; i++) {
            for (int j = 0; j < board[0].length; j++) {
                board_copy[i][j] = board[i][j];
            }
        }
        return board_copy;
    }


    // Getter
    public int[] getSize() {
        return size;
    }
    public int getNumber_of_mines() {
        return number_of_mines;
    }
    public boolean[][] getBoard_mines() {
        return board_mines;
    }
    public boolean[][] getBoard_covered() {
        return board_covered;
    }

    // Setter - Open Cell
    public void open_cell(int row, int column) {
        board_covered[row][column] = false;

        if (!board_mines[row][column] && this.calculate_number_of_surrounding_mines(row, column) == 0) {
            for (int[] position : calculate_surrounding_cells(row, column)) {
                if (board_covered[position[0]][position[1]]) {
                    open_cell(position[0], position[1]);
                }
            }
        }
    }

    // *** Setter für Administrator ***
    public void setBoard_covered(boolean[][] board_covered) {
        this.board_covered = board_covered;
    }
    public void setBoard_mines(boolean[][] board_mines) {
        this.board_mines = board_mines;
        this.number_of_mines = this.calculate_number_of_mines();
    }
    public void editGame_Field(boolean[][] board_mines) {
        this.board_mines = board_mines;
        this.board_covered = Game_Field_Collection.create_empty_board(this.size, true);

        this.size = new int[]{board_mines.length, board_mines[0].length};
        this.number_of_mines = this.calculate_number_of_mines();
    }






    // Print board
    public void print_board(long time_start) {
        System.out.println();
        StringBuilder first_line = new StringBuilder("   ");
        for (int i = 97; i < 97 + size[1] && i < 97 + 26; i++) {
            first_line.append((char) i).append(" ");
        }
        for (int i = 65; i < 65 + size[1] - 26 && i < 65 + 26; i++) {
            first_line.append((char) i).append(" ");
        }
        first_line.append(quad + "* Informationen *");
        System.out.println(first_line);

        for (int i = 0; i < size[0]; i++) {
            StringBuilder line_i = i < 9 ? new StringBuilder("0" + (i + 1)) : new StringBuilder("" + (i + 1));

            for (int j = 0; j < size[1]; j++) {
                if (board_covered[i][j]) {
                    line_i.append(covered);
                } else if (board_mines[i][j]){
                    line_i.append(mine);
                } else {
                    int n = calculate_number_of_surrounding_mines(i, j);
                    if (n == 0) {
                        line_i.append(empty);
                    } else {
                        line_i.append(" ").append(n);
                    }
                }
            }
            line_i.append(" ");
            switch (i) {
                case 1:
                    line_i.append(quad + "Anzahl der Minen: ").append(number_of_mines);
                    break;
                case 2:
                    long time_end = System.nanoTime();
                    double time = (time_end - time_start) / 1_000_000_000.0;
                    line_i.append(quad + "Zeit: ").append(String.format("%.2f", time)).append("s");
                    break;
            }
            System.out.println(line_i);
        }
        System.out.println();
    }

    // *** Print-Method for Administrator ***
    public void print_board_uncovered(long time_start) {
        boolean[][] temp_board_covered = board_covered;
        this.setBoard_covered(Game_Field_Collection.create_empty_board(size, false));

        this.print_board(time_start);
        this.setBoard_covered(temp_board_covered);
    }




    // Check game status      * -1 Lose     * 0 not over yet     * 1 Win
    public int check_end() {
        // Überprüfen, ob eine Mine getroffen wurde
        for (int i = 0; i < size[0]; i++) {
            for (int j = 0; j < size[1]; j++) {
                if (board_mines[i][j] && !board_covered[i][j]) {
                    return -1;
                }
            }
        }

        for (int i = 0; i < size[0]; i++) {
            for (int j = 0; j < size[1]; j++) {
                if (!board_mines[i][j] && board_covered[i][j]) {
                    return 0;
                }
            }
        }
        return 1;
    }


}