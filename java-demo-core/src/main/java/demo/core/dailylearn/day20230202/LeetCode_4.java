package demo.core.dailylearn.day20230202;

import java.util.Arrays;

/**
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
