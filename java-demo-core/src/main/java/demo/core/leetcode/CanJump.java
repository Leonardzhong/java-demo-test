package demo.core.leetcode;

import com.google.gson.Gson;

/**
 * leetcode 55
 *
 * @author leonard
 * @create 2023-02-20 21:40
 */
public class CanJump {

    public static void main(String[] args) {

        //int[] nums = {2, 3, 1, 1, 4};

        int[] nums = {3, 2, 1, 0, 4};

        System.out.println("canJump input=" + new Gson().toJson(nums));

        boolean res;

        res = canJump(nums);

        System.out.println("canJump output=" + res);

    }

    private static boolean canJump(int[] nums) {

        //dp[i]：从[0,i][0 , i][0,i]的任意一点处出发，你最大可以跳跃到的位置。
        int[] dp = new int[nums.length];

        dp[0] = nums[0];

        if (dp[0] == 0) {
            return false;
        }

        //注意：i < nums.length - 1;
        for (int i = 1; i < nums.length - 1; i++) {

            dp[i] = Math.max(dp[i - 1], i + nums[i]);

            if (dp[i] == i) {
                return false;
            }
        }

        return true;
    }
}
