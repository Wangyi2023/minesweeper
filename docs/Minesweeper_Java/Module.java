package Minesweeper_Java;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Objects;

public class Module {
    protected int mines;
    protected int[][] covered_positions;

    // Konstruktor
    public Module(int mines, int[][] covered_positions) {
        this.mines = Math.max(mines, 0);
        this.covered_positions = covered_positions;
    }

    // Konstruktor für Game_Field
    public Module(Game_Field game_field) {
        this.mines = game_field.getNumber_of_mines();
        this.covered_positions = game_field.calculate_all_covered_positions();
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) {
            return true;
        }
        if (other == null || getClass() != other.getClass()) {
            return false;
        }
        Module module_other = (Module) other;
        return equals(module_other);
    }

    @Override
    public int hashCode() {
        return Objects.hash(mines, Arrays.deepHashCode(covered_positions));
    }

    @Override
    public String toString() {
        StringBuilder str = new StringBuilder(mines + ",  ");
        for (int[] position : covered_positions) {
            str.append("(").append(position[0]).append(",").append(position[1]).append(") ");
        }
        return str.toString();
    }

    // Methoden, die die Relation zwischen zwei Module bestimmen.
    // 1-5
    public boolean equals(Module other) {
        return this.subset(other) && other.subset(this) && this.getMines() == other.getMines();
    }
    // 1-4
    public boolean real_subset(Module other) {
        return this.subset(other) && !other.equals(this);
    }
    // 1-3
    public boolean subset(Module other) {
        for (int[] covered_position : covered_positions) {
            if (!other.contains(covered_position)) {
                return false;
            }
        }
        return true;
    }
    // 1-2
    public boolean real_intersect(Module other) {
        return this.intersect(other) && !this.subset(other) && !other.subset(this);
    }
    // 1-1
    public boolean intersect(Module other) {
        for (int[] covered_position : covered_positions) {
            if (other.contains(covered_position)) {
                return true;
            }
        }
        return false;
    }
    // 1-0
    public boolean contains(int[] position) {
        for (int[] covered_position : covered_positions) {
            if (covered_position[0] == position[0] && covered_position[1] == position[1]) {
                return true;
            }
        }
        return false;
    }

    // Methoden, die die Relation zwischen zwei Module berechnen.
    // 2-1
    public int[][] intersection(Module other) {
        ArrayList<int[]> intersection_cells = new ArrayList<>();
        for (int[] covered_position : covered_positions) {
            if (other.contains(covered_position)) {
                intersection_cells.add(covered_position);
            }
        }
        return intersection_cells.toArray(new int[0][]);
    }
    // 2-0
    public int[][] difference(Module other) {
        ArrayList<int[]> difference_cells = new ArrayList<>();
        for (int[] covered_position : covered_positions) {
            if (!other.contains(covered_position)) {
                difference_cells.add(covered_position);
            }
        }
        return difference_cells.toArray(new int[0][]);
    }

    // Getter
    public int getMines() {
        return mines;
    }
    public int[][] getCovered_positions() {
        return covered_positions;
    }
}
