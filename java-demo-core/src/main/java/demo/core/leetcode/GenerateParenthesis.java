package demo.core.leetcode;

import java.util.ArrayList;
import java.util.List;

/**
 * leetcode 22
 *
 * @author leonard
 * @create 2023-04-20 11:14
 */
public class GenerateParenthesis {

    public static void main(String[] args) {
        int n = 3;
        System.out.println("final result is=" + generateParenthesis(n));

    }

    public static List<String> generateParenthesis(int n) {

        List<String> res = new ArrayList<>();

        if (n < 1) {
            return res;
        }

        StringBuilder stringBuilder = new StringBuilder();

        backtrack(res, stringBuilder, n, n);

        return res;
    }

    //left 表示左括号剩余的个数
    public static void backtrack(List<String> res, StringBuilder stringBuilder, int left, int right) {

        if (left == 0 && right == 0) {
            res.add(stringBuilder.toString());
            System.out.println("after recursive, res =" + res.toString());
            return;
        }

        if (left > right) {
            return;
        }

        if (left > 0) {
            backtrack(res, stringBuilder.append('('), left - 1, right);
            stringBuilder.deleteCharAt(stringBuilder.length() - 1);
        }

        if (right > 0) {
            backtrack(res, stringBuilder.append(')'), left, right - 1);
            stringBuilder.deleteCharAt(stringBuilder.length() - 1);
        }

    }
}
