package dailylearn.day20190319;

/**
 * Demo
 *
 * @author zhongya
 * @date 2019/03/19
 */
public class StringPatternMatch {
    public static void main(String[] args) {
        String s1 = "aabcd";
        String s2 = "abc";
        int res = findStartIndex(s1, s2);
        System.out.println(res);
    }

    private static int findStartIndex(String s1, String s2) {
        char[] c1 = s1.toCharArray();
        char[] c2 = s2.toCharArray();
        int l1 = s1.length();
        int l2 = s2.length();
        int i = 0;
        int j = 0;
        while (i < l1 && j < l2) {
            if (c1[i] == c2[j]) {
                i++;
                j++;
            } else {
                i = i - j + 1;
                j = 0;
            }
        }
        if (j == l2) {
            return i - j;
        }
        return -1;
    }

}
