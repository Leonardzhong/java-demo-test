package demo.core.leetcode;

/**
 *
 * leetcode 198
 *  打家劫舍
 * @author leonard
 * @create 2023-03-06 23:12
 */
public class Rob {

    public static void main(String[] args) {

        int[] nums = {1, 2, 3, 1};

        int res = rob(nums);

        System.out.println(res);

    }


    public static int rob(int[] nums) {

        if (nums == null || nums.length == 0) {
            return 0;
        }

        if (nums.length == 1) {
            return nums[0];
        }

        int[] dp = new int[nums.length];

        dp[0] = nums[0];

        dp[1] = Math.max(nums[0], nums[1]);

        for (int i = 2; i < nums.length; i++) {

            dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i]);
        }

        return Math.max(dp[nums.length - 1], dp[nums.length - 2]);

    }

}
