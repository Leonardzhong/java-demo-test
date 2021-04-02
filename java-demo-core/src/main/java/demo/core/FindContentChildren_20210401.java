package demo.core;

import java.util.Arrays;

/**
 * @author zhongya
 * @date 2021/4/1 16:33
 *
 * 假设你是一位很棒的家长，想要给你的孩子们一些小饼干。但是，每个孩子最多只能给一块饼干。
 *
 * 对每个孩子 i，都有一个胃口值 g[i]，这是能让孩子们满足胃口的饼干的最小尺寸；并且每块饼干 j，都有一个尺寸 s[j] 。
 * 如果 s[j] >= g[i]，我们可以将这个饼干 j 分配给孩子 i ，这个孩子会得到满足。你的目标是尽可能满足越多数量的孩子，并输出这个最大数值。
 *
 * 来源：力扣（LeetCode）
 * 链接：https://leetcode-cn.com/problems/assign-cookies
 * 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
 */
public class FindContentChildren_20210401 {

    public static void main(String[] args) {
        int[] g = {10,9,8,7};
        int[] s = {5,6,7,8};
        System.out.println(findContentChildren(g, s));
    }

    public static int findContentChildren(int[] g, int[] s) {
        Arrays.sort(g);
        Arrays.sort(s);
        int i = 0;
        int j = 0;
        int gLength = g.length;
        int sLength = s.length;
        int res = 0;
        while (i < gLength && j < sLength) {
            if (g[i] <= s[j]) {
                i++;
                j++;
                res++;
            }else{
                j++;
            }
        }
        return res;
    }
}
