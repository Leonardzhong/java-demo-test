package demo.core.leetcode;

import java.util.List;

/**
 *
 * 给你一个由若干括号和字母组成的字符串 s ，删除最小数量的无效括号，使得输入的字符串有效。
 *
 * 返回所有可能的结果。答案可以按 任意顺序 返回。
 * https://leetcode-cn.com/problems/remove-invalid-parentheses/
 *
 * 输入: "()())()"
 * 输出: ["()()()", "(())()"]
 * @author zhongya
 * @date 2021/4/9 19:09
 */
public class RemoveInvalidParentheses_20210409 {

    public static void main(String[] args) {
        String s = "()())()";
        List<String> res =  removeInvalidParentheses(s);
        System.out.println(res);
    }

    public static List<String> removeInvalidParentheses(String s) {
        return null;
    }

}
