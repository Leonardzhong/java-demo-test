package demo.core.leetcode;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * @author zhongya
 * @create 2021/3/30 15:51
 * 给定一个三角形 triangle ，找出自顶向下的最小路径和。
 * <p>
 * 每一步只能移动到下一行中相邻的结点上。相邻的结点 在这里指的是 下标 与 上一层结点下标 相同或者等于 上一层结点下标 + 1 的两个结点。也就是说，如果正位于当前行的下标 i ，那么下一步可以移动到下一行的下标 i 或 i + 1 。
 * <p>
 * 来源：力扣（LeetCode）
 * 链接：https://leetcode-cn.com/problems/triangle
 * 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
 * <p>
 */
public class MinimumTotalTriangle_20210330 {

    public static void main(String[] args) {
        List<Integer> list1 = Arrays.asList(2);
        List<Integer> list2 = Arrays.asList(3, 4);
        List<Integer> list3 = Arrays.asList(6, 5, 7);
        List<Integer> list4 = Arrays.asList(4, 1, 8, 3);

        List<List<Integer>> list = new ArrayList<>();
        list.add(list1);
        list.add(list2);
        list.add(list3);
        list.add(list4);
        System.out.println(minimumTotal(list));

    }

    public static int minimumTotal(List<List<Integer>> triangle) {
        int i = triangle.size();
        int[][] dp = new int[i][i];
        for (int j = 0; j < i; j++) {
            for (int p = 0; p < i; p++) {
                dp[j][p] = Integer.MAX_VALUE;
            }
        }
        int n = 1;
        dp[0][0] = triangle.get(0).get(0);
        while (n < i) {
            for (int m = 0; m <= n; m++) {
                int k = Math.max(m - 1, 0);
                dp[n][m] = Math.min(dp[n - 1][k], dp[n - 1][m]) + triangle.get(n).get(m);
            }
            n++;
        }
        int min = Integer.MAX_VALUE;
        for (int l = 0; l < i; l++) {
            min = Math.min(dp[i - 1][l], min);
        }
        return min;
    }
}