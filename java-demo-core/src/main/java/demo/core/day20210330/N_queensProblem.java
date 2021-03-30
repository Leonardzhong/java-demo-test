package demo.core.day20210330;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

/**
 * @author zhongya
 * @date 2021/3/30 14:37
 *
 * https://leetcode-cn.com/problems/n-queens/submissions/
 */
public class N_queensProblem {

    public static void main(String[] args) {
        System.out.println(solveNQueens(4));

    }

    public static List<List<String>> solveNQueens(int n) {
        //初始化全部为 "."
        char[][] board = new char[n][n];
        for(int i = 0; i < n; i++)
            for(int j = 0; j < n; j++)
                board[i][j] = '.';
        List<List<String>> res = new ArrayList<List<String>>();

        //按行回溯
        dfs(board, 0, res);
        return res;
    }

    private static void dfs(char[][] board, int colIndex, List<List<String>> res) {
        //列到达边界
        if(colIndex == board.length) {
            res.add(construct(board));
            return;
        }

        for(int i = 0; i < board.length; i++) {
            if(validate(board, i, colIndex)) {
                board[i][colIndex] = 'Q';
                dfs(board, colIndex + 1, res);
                board[i][colIndex] = '.';
            }
        }
    }

    //横竖斜位置为无效
    private static boolean validate(char[][] board, int x, int y) {
        for(int i = 0; i < board.length; i++) {
            for(int j = 0; j < y; j++) {
                if(board[i][j] == 'Q' && (x + j == y + i || x + y == i + j || x == i))
                    return false;
            }
        }

        return true;
    }

    //board数组转化为List
    private static List<String> construct(char[][] board) {
        List<String> res = new LinkedList<String>();
        for(int i = 0; i < board.length; i++) {

            String s = new String(board[i]);

            //按行进行添加
            res.add(s);
        }
        return res;
    }
}
