package demo.core.dailylearn.day20230202;

import java.util.Arrays;

/**
 * 给定两个大小分别为 m 和 n 的正序（从小到大）数组 nums1 和 nums2。请你找出并返回这两个正序数组的 中位数 。
 *
 * 算法的时间复杂度应该为 O(log (m+n)) 。
 * @author leonard
 * @create 2023-02-05 20:50
 */
public class LeetCode_4 {

    public static void main(String[] args) {
        int[] nums1 = {1, 2};
        int[] nums2 = {3, 4};

        double l = findMedianSortedArrays(nums1, nums2);

        System.out.println(l);

    }

    public static double findMedianSortedArrays(int[] nums1, int[] nums2) {
        int m = nums1.length;
        int n = nums2.length;

        double l;

        int[] res = new int[m+n];

        for(int i = 0; i < m; i++){
            res[i] = nums1[i];
        }

        for(int j = 0; j < n; j++){
            res[m +j] = nums2[j];
        }

        Arrays.sort(res);

        if((m + n) % 2 == 0){
            l = (res[(m + n) / 2 - 1] + res[(m + n) /2]) / 2.0;
        }else{
            l = res[(m + n) / 2];
        }

        return l;
    }
}
