package Minesweeper_Java;

public class Game_Field_Collection {

    public static boolean[][] create_empty_board(int[] size, boolean bl) {
        boolean[][] board = new boolean[size[0]][size[1]];
        for (int i = 0; i < size[0]; i++) {
            for (int j = 0; j < size[1]; j++) {
                board[i][j] = bl;
            }
        }
        return board;
    }
    public static boolean[][] create_empty_board(int[] size) {
        return create_empty_board(size, false);
    }

    public static boolean[][] creat_board(int[] size, int[][] positions) {
        boolean[][] board = create_empty_board(size);
        for (int[] position : positions) {
            board[position[0]][position[1]] = true;
        }
        return board;
    }

    // Test-Size  8x8
    public static int[] test_size = new int[]{8, 8};

    // 01
    public static int[][] position_list_01 = new int[][]{{0, 0}, {2, 0}, {2, 1}};
    public static Game_Field game_field_01 = new Game_Field(creat_board(test_size, position_list_01));
    // 02
    public static int[][] position_list_02 = new int[][]{{0, 0}, {2, 0}, {3, 0}, {3, 1}, {4, 0}, {4, 1}};
    public static Game_Field game_field_02 = new Game_Field(creat_board(test_size, position_list_02));
    // 03
    public static int[][] position_list_03 = new int[][]{{0, 0}, {2, 0}, {3, 0}, {5, 0}, {5, 1}};
    public static Game_Field game_field_03 = new Game_Field(creat_board(test_size, position_list_03));
    // 04
    public static int[][] position_list_04 = new int[][]{{0, 0}, {0, 1}, {2, 1}, {3, 0}, {3, 1}};
    public static Game_Field game_field_04 = new Game_Field(creat_board(test_size, position_list_04));
    // 05
    public static int[][] position_list_05 = new int[][]{{1, 0}, {2, 0}, {3, 1}, {4, 0}, {4, 1}};
    public static Game_Field game_field_05 = new Game_Field(creat_board(test_size, position_list_05));

    // 06
    public static int[][] position_list_06 = new int[][]{{0, 1}, {1, 0}, {2, 1}, {3, 0}, {4, 1}, {5, 0}, {5, 1}};
    public static Game_Field game_field_06 = new Game_Field(creat_board(test_size, position_list_06));
    // 07
    public static int[][] position_list_07 = new int[][]{{0, 1}, {2, 0}, {2, 1}, {4, 1}, {5, 0}, {5, 1}};
    public static Game_Field game_field_07 = new Game_Field(creat_board(test_size, position_list_07));
    // 08
    public static int[][] position_list_08 = new int[][]{{0, 0}, {1, 1}, {2, 2}};
    public static Game_Field game_field_08 = new Game_Field(creat_board(test_size, position_list_08));
    // 09
    public static int[][] position_list_09 = new int[][]{{0, 1}, {1, 0}, {2, 2}};
    public static Game_Field game_field_09 = new Game_Field(creat_board(test_size, position_list_09));
    // 10
    public static int[][] position_list_10 = new int[][]{{0, 0}, {0, 1}, {1, 0}, {2, 2}};
    public static Game_Field game_field_10 = new Game_Field(creat_board(test_size, position_list_10));

    // 11
    public static int[][] position_list_11 = new int[][]{{1, 1}, {2, 2}};
    public static Game_Field game_field_11 = new Game_Field(creat_board(test_size, position_list_11));
    // 12
    public static int[][] position_list_12 = new int[][]{{0, 1}, {1, 1}, {2, 0}, {2, 1}};
    public static Game_Field game_field_12 = new Game_Field(creat_board(test_size, position_list_12));
    // 13
    public static int[][] position_list_13 = new int[][]{{0, 1}, {1, 0}, {1, 1}, {2, 0}, {2, 1}};
    public static Game_Field game_field_13 = new Game_Field(creat_board(test_size, position_list_13));
    // 14
    public static int[][] position_list_14 = new int[][]{{0, 0}, {2, 0}, {3, 0}, {5, 0}, {6, 0}};
    public static Game_Field game_field_14 = new Game_Field(creat_board(test_size, position_list_14));
    // 15
    public static int[][] position_list_15 = new int[][]{{0, 1}, {1, 0}, {2, 2}, {5, 5}, {6, 6}, {7, 7}};
    public static Game_Field game_field_15 = new Game_Field(creat_board(test_size, position_list_15));

    // 16
    public static int[][] position_list_16 = new int[][]{{0, 0}, {0, 1}, {1, 0}, {2, 2}, {5, 5}, {6, 6}, {7, 7}};
    public static Game_Field game_field_16 = new Game_Field(creat_board(test_size, position_list_16));
    // 17
    public static int[][] position_list_17 = new int[][]{{0, 0}, {0, 1}, {1, 0}, {2, 2}, {5, 5}, {6, 6}};
    public static Game_Field game_field_17 = new Game_Field(creat_board(test_size, position_list_17));
    // 18
    public static int[][] position_list_18 = new int[][]{{0, 0}, {0, 1}, {1, 0}, {2, 2}, {5, 5}, {6, 7}, {7, 6}, {7, 7}};
    public static Game_Field game_field_18 = new Game_Field(creat_board(test_size, position_list_18));



}
