package Minesweeper_Java;

import java.util.Scanner;

public class Minesweeper {
    // *** Begin Main
    public static void main(String[] args) {
        long time_start = System.nanoTime();
        print_welcome_message();

        Game_Field game_field_0 = Game_Field_Collection.game_field_16;
        game_field_0.print_board(time_start);

        while (game_field_0.check_end() == 0) {
            int[] position = select_position(game_field_0);
            // In Case Unsolvable - Reset Game Field
            if (!game_field_0.solvable()
                    && game_field_0.getBoard_mines()[position[0]][position[1]]) {
                game_field_0.reset_game_field(position);
            }
            game_field_0.open_cell(position[0], position[1]);
            game_field_0.print_board(time_start);
        }
        print_end_message(game_field_0.check_end());
    }
    // End Main ***






    // Select Position
    public static int[] select_position(Game_Field game_field) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("Bitte wählen Sie eine Position:");

        int row = scanner.nextInt();
        int column = scanner.next().charAt(0);

        if (column >= 65 && column < 65 + 26) {
            column += 97 - 65 + 26;
        }

        row -= 1;
        column -= 'a';
        if (row >= 0 && row < game_field.getSize()[0] && column >= 0 && column < game_field.getSize()[1]
                && game_field.getBoard_covered()[row][column]) {
            return new int[]{row, column};
        } else {
            System.out.println("Error. Diese Position ist nicht valid");
            return select_position(game_field);
        }
    }


    // Message
    public static void print_welcome_message() {
        System.out.println(" ");
        System.out.println("----------- Minesweeper -----------");
    }

    public static void print_end_message(int status) {
        switch (status) {
            case 1:
                System.out.println("Win "); break;
            case -1:
                System.out.println("Lose"); break;
        }
    }
}

