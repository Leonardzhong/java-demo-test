package demo.core.dailylearn.day20190316;

/**
 *  max sum of consecutive array
 * input:[-1, 0 , 1, 2, 5, 3]
 * output:
 * @author zhongya
 * @date 2019/03/16
 */
public class MaxSum {
    public static void main(String[] args) {
        int[] nums = {-1, 0, 1, 2, 5, 3};
        int maxSum = findMaxSumIII(nums);
        System.out.println(maxSum);
    }

    private static int findMaxSumI(int[] nums) {
        if (nums == null || nums.length < 1) {
            return 0;
        }
        int i;
        int j;
        int maxSum = 0;
        for (i = 0; i < nums.length; i++) {
            int curSum = 0;
            for (j = i; j < nums.length; j++) {
                curSum += nums[j];
                if (curSum > maxSum) {
                    maxSum = curSum;
                }
            }
        }
        return maxSum;
    }

    private static int findMaxSumII(int[] nums) {
        int i;
        int maxSum = 0;
        int curSum = 0;
        for (i = 0; i < nums.length; i++) {
             curSum += nums[i];
            if (curSum > maxSum) {
                maxSum = curSum;
            }
            if (curSum < 0) {
                curSum = 0;
            }

        }
        return maxSum;
    }

    /**
     * DP
     * if f[i-1] >= 0
     * f[i] = f[i-1] + nums[i]
     * else f[i] = nums[i]
     * @param nums
     * @return
     */
    private static int findMaxSumIII(int[] nums) {
        int i = 0;
        int curSum = nums[i];
        int maxSum = nums[i];
        for (i = 1; i < nums.length; i++) {
            curSum = (curSum + nums[i] > nums[i]) ? curSum + nums[i] : nums[i];
            if (maxSum < curSum) {
                maxSum = curSum;
            }
        }
        return maxSum;
    }
}
