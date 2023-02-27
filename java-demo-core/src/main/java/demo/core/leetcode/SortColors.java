package demo.core.leetcode;

import com.google.gson.Gson;
import com.google.gson.internal.$Gson$Types;

/**
 * leetcode 75
 *
 * @author leonard
 * @create 2023-02-21 22:55
 */
public class SortColors {

    public static void main(String[] args) {
        //int[] nums = {2, 0, 2, 1, 1, 0};

        int[] nums = {1, 2 , 0};

        System.out.println("sortColors, input=" + new Gson().toJson(nums));

        // sortColors(nums);

        sortColorsTwoPointer(nums);

        System.out.println("sortColors, output=" + new Gson().toJson(nums));


    }

    private static void sortColorsTwoPointer(int[] nums) {

        if (nums.length == 1) {
            return;
        }

        int p = 0, q = nums.length - 1;

        for (int i = 0; i < nums.length; i++) {

            while (nums[i] == 2 && i <= q) {
                swap(nums, q, i);
                q--;
            }

            if (nums[i] == 0) {
                swap(nums, p, i);
                p++;
            }


        }

    }

    private static void swap(int[] nums, int p, int q) {
        int temp = nums[p];
        nums[p] = nums[q];
        nums[q] = temp;

    }

    private static void sortColors(int[] nums) {
        int i = 0, j = 0, k = 0;

        for (int num : nums) {
            if (num == 0) {
                i++;
            }

            if (num == 1) {
                j++;
            }

            if (num == 2) {
                k++;
            }
        }

        for (int n = 0; n < nums.length; n++) {
            if (n < i) {
                nums[n] = 0;
            }
            if (n >= i && n < i + j) {
                nums[n] = 1;
            }

            if (n >= i + j && n < i + j + k) {
                nums[n] = 2;
            }
        }

    }
}
