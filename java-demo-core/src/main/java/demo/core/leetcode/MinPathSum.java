package demo.core.leetcode;

import com.google.gson.Gson;

/**
 * leetcode 64
 *
 * @author leonard
 * @create 2023-02-20 22:57
 */
public class MinPathSum {

    public static void main(String[] args) {

        //int[][] grid = {{1, 3, 1}, {1, 5, 1}, {4, 2, 1}};

        int[][] grid = {{1, 2, 3}, {4, 5, 6}};

        System.out.println("minPathSum input=" + new Gson().toJson(grid));

        int res;

        res = minPathSum(grid);

        System.out.println("minPathSum output=" + res);

    }

    private static int minPathSum(int[][] grid) {

        int m = grid.length;

        int n = grid[0].length;

        int[][] dp = new int[m][n];

        dp[0][0] = grid[0][0];

        for (int i = 1; i < m; i++) {
            dp[i][0] = grid[i][0] + dp[i - 1][0];
        }

        for (int j = 1; j < n; j++) {
            dp[0][j] = grid[0][j] + dp[0][j - 1];
        }

        return findMinPathSum(grid, m, n, dp);

    }

    static int findMinPathSum(int[][] grid, int m, int n, int[][] dp) {
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1]) + grid[i][j];
            }
        }

        return dp[m - 1][n - 1];
    }
}
