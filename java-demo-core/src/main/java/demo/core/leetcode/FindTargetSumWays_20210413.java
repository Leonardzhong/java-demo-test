package demo.core.leetcode;

/**
 * @author zhongya
 * @date 2021/4/13 12:15
 * leetcode 494
 */
public class FindTargetSumWays_20210413 {

    private static int count;

    public static void main(String[] args) {
        int[] nums = {1, 1, 1, 1, 1};
        int S = 3;
        System.out.println(findTargetSumWays(nums, S));
    }
    public static int findTargetSumWays(int[] nums, int S) {
        calculate(nums, 0, 0, S);
        return count;
    }
    public static void calculate(int[] nums, int i, int sum, int S) {
        if (i == nums.length) {
            if (sum == S){
                count++;
            }
        } else {
            calculate(nums, i + 1, sum + nums[i], S);
            calculate(nums, i + 1, sum - nums[i], S);
        }
    }
}
