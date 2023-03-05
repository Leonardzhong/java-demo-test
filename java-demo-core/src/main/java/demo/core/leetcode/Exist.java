package demo.core.leetcode;

/**
 * leetcode 79
 * 单词搜索
 * @author leonard
 * @create 2023-02-28 22:06
 */
public class Exist {

    public static void main(String[] args) {

        char[][] board = {{'A', 'B', 'C', 'E'}, {'S', 'F', 'C', 'S'}, {'A', 'D', 'E', 'E'}};

        String word = "ABCCED";

        boolean res = exist(board, word);

        System.out.println("exist, output=" + res);


    }

    private static boolean exist(char[][] board, String word) {

        return false;
    }
}
