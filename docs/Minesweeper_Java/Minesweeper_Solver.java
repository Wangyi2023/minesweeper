package Minesweeper_Java;

import java.util.ArrayList;
import java.util.Set;

public class Minesweeper_Solver {
    public static final double EPSILON = 1e-10;

    // Main-ALG
    public static int[][] alg(Game_Field game_field) {
        // 1.Situation   *** First-step ***
        if (first_step(game_field)) {
            System.out.println(" * Random *   Type 1");
            return new int[][]{select_random(game_field)};
        }

        // Creat Module-Collection
        Set<Module> module_collection = game_field.calculate_complete_module_collection();

        // Creat Selected-Positions-List
        ArrayList<int[]> selected_positions = new ArrayList<>();
        for (Module module : module_collection) {
            if (module.getMines() == 0) {
                for (int[] position : module.getCovered_positions()) {
                    boolean contains = false;
                    for (int[] selected_position : selected_positions) {
                        if (position[0] == selected_position[0] && position[1] == selected_position[1]) {
                            contains = true;
                            break;
                        }
                    }
                    if (contains) {
                        continue;
                    }
                    selected_positions.add(position);
                }
            }
        }

        // 2.Situation   *** Unsolvable ***
        if (selected_positions.isEmpty()) {
            double min_probability = 1.0 - EPSILON;
            int[] position_rand = new int[2];
            for (Module module : module_collection) {
                double probability = calculate_probability_for_module(module);
                if (probability < min_probability) {
                    min_probability = probability;
                    position_rand = module.getCovered_positions()[0];
                }
            }
            System.out.println(" * Random *   Type 2");
            return new int[][]{position_rand};
        }

        // 3.Situation   *** Solvable ***
        // Sortieren
        for (int i = 0; i < selected_positions.size(); i++) {
            boolean sortiert = false;
            for (int j = 0; j < selected_positions.size() - i - 1; j++) {
                if (selected_positions.get(j)[0] > selected_positions.get(j + 1)[0]
                        || (selected_positions.get(j)[0] == selected_positions.get(j + 1)[0]
                        && selected_positions.get(j)[1] > selected_positions.get(j + 1)[1])) {
                    int[] temp = selected_positions.get(j);
                    selected_positions.set(j, selected_positions.get(j + 1));
                    selected_positions.set(j + 1, temp);
                    sortiert = true;
                }
            }
            if (!sortiert) {
                break;
            }
        }

        // End Main-ALG
        return selected_positions.toArray(new int[0][2]);
    }





    // Hilfsmethoden für Haupt-Algorithmus
    public static int[] select_random(Game_Field game_field) {
        int row = (int) (Math.random() * game_field.getSize()[0]);
        int column = (int) (Math.random() * game_field.getSize()[1]);

        return new int[]{row, column};
    }
    public static boolean first_step(Game_Field game_field) {
        for (int i = 0; i < game_field.getSize()[0]; i++) {
            for (int j = 0; j < game_field.getSize()[1]; j++) {
                if (!game_field.getBoard_covered()[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }
    public static double calculate_probability_for_module(Module module) {
        return (double) module.getMines() / module.getCovered_positions().length;
    }





    // Main-Code for the test
    public static void main(String[] args) {
        long time_start = System.nanoTime();

        System.out.println();
        System.out.println("Test for " + Minesweeper_Solver.class.getName() + " Algorithm");

        Game_Field game_field_0 = new Game_Field(new int[]{16, 40}, 99);
        game_field_0.print_board(time_start);

        while (game_field_0.check_end() == 0) {
            int[][] positions = alg(game_field_0);
            for (int[] position : positions) {
                System.out.println("Selection: " + (position[0] + 1) + ", " + (position[1] + 1) + " ");
                if (!game_field_0.solvable()
                        && game_field_0.getBoard_mines()[position[0]][position[1]]) {
                    game_field_0.reset_game_field(position);
                }
                game_field_0.open_cell(position[0], position[1]);
            }
            game_field_0.print_board(time_start);

            try {
                Thread.sleep(1);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }
        System.out.println("End      code " + game_field_0.check_end());
    }
}

