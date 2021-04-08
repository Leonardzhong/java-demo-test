package demo.core.leetcode;

/**
 * @author zhongya
 * @date 2021/4/6 16:34
 * <p>
 * 给你两个单词 word1 和 word2，请你计算出将 word1 转换成 word2 所使用的最少操作数 。
 * <p>
 * 你可以对一个单词进行如下三种操作：
 * <p>
 * 插入一个字符
 * 删除一个字符
 * 替换一个字符
 * <p>
 * 输入：word1 = "horse", word2 = "ros"
 * 输出：3
 * 解释：
 * horse -> rorse (将 'h' 替换为 'r')
 * rorse -> rose (删除 'r')
 * rose -> ros (删除 'e')
 * <p>
 * 来源：力扣（LeetCode）
 * 链接：https://leetcode-cn.com/problems/edit-distance
 * 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
 */
public class MinDistance_20210406 {

    public static void main(String[] args) {
        String word1 = "intention";
        String word2 = "execution";
        System.out.println(minDistance(word1, word2));

    }

    public static int minDistance(String word1, String word2) {
        int l1 = word1.length();
        int l2 = word2.length();
        //边界条件
        if (l1 * l2 == 0) {
            return l1 + l2;
        }
        //定义dp[i][j]表示word1第i为到word2第j位的编辑距离
        int[][] dp = new int[l1 + 1][l2 + 1];
        //初始值，当word1或者word2为空串时，编辑距离等于字符串长度
        for (int i = 0; i < l1 + 1; i++) {
            dp[i][0] = i;
        }
        for (int i = 0; i < l2 + 1; i++) {
            dp[0][i] = i;
        }

        for (int i = 1; i < l1 + 1; i++) {
            for(int j = 1; j < l2 + 1; j++){
                int left = dp[i-1][j] + 1;
                int down = dp[i][j-1] + 1;
                int left_down = dp[i-1][j-1];
                if (word1.charAt(i - 1) != word2.charAt(j - 1)) {
                    left_down += 1;
                }
                dp[i][j] = Math.min(left, Math.min(down, left_down));
            }
        }
        return dp[l1][l2];
    }

}
