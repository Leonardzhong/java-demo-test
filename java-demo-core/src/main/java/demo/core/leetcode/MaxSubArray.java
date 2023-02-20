package demo.core.leetcode;

import com.google.gson.Gson;

/**
 * leetcode_53
 * 动态规划
 *
 * @author leonard
 * @create 2023-02-19 22:03
 */
public class MaxSubArray {

    public static void main(String[] args) {

        int res;

        //int[] nums = {5, 4, -1, 7, 8};

        int[] nums = {-2, 1, -3, 4, -1, 2, 1, -5, 4};

        System.out.println("maxSubArray input = " + new Gson().toJson(nums));

        res = maxSubArray(nums);

        System.out.println("maxSubArray result = " + res);

    }

    private static int maxSubArray(int[] nums) {

        //dp[i] 表示以i结尾的连续子数组和
        int[] dp = new int[nums.length];

        dp[0] = nums[0];

        for (int i = 1; i < nums.length; i++) {

            if (dp[i - 1] > 0) {
                dp[i] = dp[i - 1] + nums[i];
            } else {
                dp[i] = nums[i];
            }
        }

        int res = dp[0];

        for (int i = 1; i < nums.length; i++) {

            if (dp[i] > res) {
                res = dp[i];
            }
        }

        return res;

    }
}
