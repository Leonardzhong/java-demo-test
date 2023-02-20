package demo.core.leetcode;

/**
 * leetcode 70
 *
 * @author leonard
 * @create 2023-02-20 23:20
 */
public class ClimbStairs {

    public static void main(String[] args) {

        int n = 2;

        int res;

        res = climbStairs(n);

        System.out.println("climbStairs, n =" + n + ",output=" + res);


    }

    private static int climbStairs(int n) {

        int[] dp = new int[n + 1];

        if (n == 1) {
            return 1;
        }

        dp[2] = 2;

        if (n <= 2) {
            return n;
        }

        for (int i = 3; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
        }

        return dp[n];
    }
}
