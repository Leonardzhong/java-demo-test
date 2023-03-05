package demo.core.leetcode;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 * 最长连续序列
 *
 * @author leonard
 * @create 2023-03-04 08:56
 */
public class LongestConsecutive {

    public static void main(String[] args) {
        int[] nums = {100, 4, 200, 1, 3, 2};

        // int res = longestConsecutive(nums);

        //int res = longestConsecutive1(nums);

        int res = longestConsecutive2(nums);

        System.out.println(res);

    }

    public static int longestConsecutive1(int[] nums) {
        // 建立一个存储所有数的哈希表，同时起到去重功能
        Set<Integer> set = new HashSet<>();
        for (int num : nums) {
            set.add(num);
        }

        int ans = 0;
        // 遍历去重后的所有数字
        for (int num : set) {
            int cur = num;
            // 只有当num-1不存在时，才开始向后遍历num+1，num+2，num+3......
            if (!set.contains(cur - 1)) {
                while (set.contains(cur + 1)) {
                    cur++;
                }
            }
            // [num, cur]之间是连续的，数字有cur - num + 1个
            ans = Math.max(ans, cur - num + 1);
        }
        return ans;
    }

    private static int longestConsecutive2(int[] nums) {

        // key表示num，value表示num最远到达的连续右边界
        Map<Integer, Integer> map = new HashMap<>();
        // 初始化每个num的右边界为自己
        for (int num : nums) {
            map.put(num, num);
        }

        int ans = 0;
        for (int num : nums) {
            if (!map.containsKey(num - 1)) {
                int right = map.get(num);
                // 遍历得到最远的右边界
                while (map.containsKey(right + 1)) {
                    right = map.get(right + 1);
                }
                // 更新右边界
                map.put(num, right);
                // 更新答案
                ans = Math.max(ans, right - num + 1);
            }

        }
        return ans;

    }


    //复杂度较高
    private static int longestConsecutive(int[] nums) {
        int res = 0;

        if (nums == null || nums.length == 0) {
            return 0;
        }

        for (int i = 0; i < nums.length; i++) {

            int current = nums[i] + 1;


            while (true) {

                //是否找到了current
                boolean flag = false;

                for (int j = 0; j < nums.length; j++) {

                    if (nums[j] == current) {

                        flag = true;

                        break;

                    }
                }

                if (!flag) {
                    break;
                }

                current += 1;
            }
            res = Math.max(res, current - nums[i]);
        }

        return res;

    }

}
