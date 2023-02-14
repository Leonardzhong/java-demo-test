package demo.core.dailylearn.day20230213;

import java.util.Stack;

/**
 * 最长有效括号
 * @author leonard
 * @create 2023-02-13 22:03
 */
public class LongestValidParentheses {

    public static void main(String[] args) {

        String s = "()";

        boolean isValid = validParentheses(s);

        System.out.println(s + ":is validParentheses=" + isValid);

        System.out.println(longestValidParentheses(s));
    }

    private static  boolean validParentheses(String s){
        Stack<Character> stack = new Stack<>();
        for(int i = 0; i < s.length(); i++){
            char c = s.charAt(i);
            if(c == '('){
                stack.push(c);
            } else{
                if(stack.empty()){
                    return false;
                }
                if(c == ')' && stack.peek() != '('){
                    return false;
                }
                //出栈
                stack.pop();
            }
        }
        return stack.empty();
    }



    //最长有效括号
    public static int longestValidParentheses(String s) {
        if (s == null || s.isEmpty()) {
            return 0;
        }

        int res = 0;



        return res;
    }
}
