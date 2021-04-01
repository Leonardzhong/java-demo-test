package demo.core.day20210330;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * @author zhongya
 * @date 2021/3/30 15:51
 * <p>
 * https://leetcode-cn.com/problems/triangle/
 */
public class MinimumTotalTriangle {

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