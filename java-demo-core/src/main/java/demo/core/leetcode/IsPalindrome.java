package demo.core.leetcode;

/**
 * Demo
 *
 * @author zhongya
 * @date 2019/03/17
 */
public class IsPalindrome {
    public static void main(String[] args) {
        String s = " ";
        boolean res = isPalindrome(s);
        System.out.println(res);
    }

    private static boolean isPalindrome(String s) {
        int low = 0;
        int high = s.length() - 1;
        while(low <= high){
            if(!isLetterOrDigit(s.charAt(low))){
                low++;
            }else if(!isLetterOrDigit(s.charAt(high))){
                high--;
            }else if(!isSameIgnoreCase(s.charAt(low), s.charAt(high))){
                return false;
            }else{
                low++;
                high--;
            }
        }
        return true;
    }

    private static boolean isSameIgnoreCase(char c1, char c2) {
        if(c1 >= 'A' && c1 <= 'Z'){
            c1 = (char)(c1 - 'A' + 'a');
        }
        if(c2 >= 'A' && c2 <= 'Z'){
            c2 = (char)(c2- 'A'+ 'a');
        }
        return c1 == c2;
    }


    private static boolean isLetterOrDigit(char c) {
        if(c>='a' && c<='z') {
            return true;
        }
        if(c>='A' && c<='Z') {
            return true;
        }
        return c >= '0' && c <= '9';
    }
}
