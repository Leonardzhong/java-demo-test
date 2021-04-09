package demo.core.leetcode;

import java.util.Arrays;

/**
 * @author leonard
 * @create 2021-04-09 21:49
 * https://leetcode-cn.com/problems/median-of-two-sorted-arrays/
 * 给定两个大小分别为 m 和 n 的正序（从小到大）数组 nums1 和 nums2。请你找出并返回这两个正序数组的 中位数 。
 */

public class FindMedianSortedArrays_20210409 {

    public static void main(String[] args) {
        int[] nums1 = {1, 2};
        int[] nums2 = {3, 4};
        System.out.println(findMedianSortedArrays(nums1, nums2));

    }

    private static double findMedianSortedArrays(int[] nums1, int[] nums2) {
        int l1 = nums1.length;
        int l2 = nums2.length;
        double result;
        int[] res = new int[l1 + l2];
        int i = 0;
        for (; i < l1; i++) {
            res[i] = nums1[i];
        }
        for (int value : nums2) {
            res[i++] = value;
        }
        Arrays.sort(res);
        if ((l1 + l2) % 2 != 0) {
            result = res[(l1 + l2) / 2];
        } else {
            result = (double) (res[(l1 + l2) / 2] + res[(l1 + l2) / 2 - 1]) / 2;
        }
        return result;
    }
}
