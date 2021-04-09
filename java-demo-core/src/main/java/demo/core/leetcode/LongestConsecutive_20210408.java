package demo.core.leetcode;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

/**
 * @author leonard
 * @create 2021-04-08 22:15
 * <p>
 * 给定一个未排序的整数数组 nums ，找出数字连续的最长序列（不要求序列元素在原数组中连续）的长度。
 * <p>
 * 进阶：你可以设计并实现时间复杂度为 O(n) 的解决方案吗？
 * <p>
 * 输入：nums = [100,4,200,1,3,2]
 * 输出：4
 * 解释：最长数字连续序列是 [1, 2, 3, 4]。它的长度为 4。
 * 来源：力扣（LeetCode）
 * 链接：https://leetcode-cn.com/problems/longest-consecutive-sequence
 * 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
 */
public class LongestConsecutive_20210408 {

    public static void main(String[] args) {
        int[] nums = {1, 2, 0, 1};
        System.out.println(longestConsecutive(nums));
        System.out.println(longestConsecutive1(nums));
    }

    public static int longestConsecutive(int[] nums) {
        Arrays.sort(nums);
        int l = nums.length;
        if (l == 0) {
            return 0;
        }
        int res = 1;
        int count = 1;
        for (int i = 1; i < l; i++) {
            if (nums[i] == nums[i - 1] + 1) {
                count++;
            } else if (nums[i] == nums[i - 1]) {
                continue;
            } else {
                count = 1;
            }
            res = Math.max(res, count);
        }
        return res;
    }

    private static int longestConsecutive1(int[] nums) {
        Set<Integer> set = new HashSet<>();
        for(int num : nums)
            set.add(num);
        int res = 0;
        for(int num : nums){
            if(set.contains(num - 1)){
                continue;
            }
            else{
                //len记录以num为左边界的连续序列的长度
                int len = 0;
                while(set.contains(num++))
                    len++;
                res = Math.max(res, len);
            }
        }
        return res;
    }
}
