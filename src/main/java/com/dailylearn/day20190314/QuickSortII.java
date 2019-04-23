package com.dailylearn.day20190314;

public class QuickSortII {

    private static void quickSort(int[] a, int low, int high) {
        if (a == null || a.length <= 0 || low >= high) {
            return;
        }
        int pivot = partition(a, low, high);
        quickSort(a, low, pivot);
        quickSort(a, pivot + 1, high);
    }
    private static int partition(int[] nums, int left, int right) {
        int pivot = nums[left], l = left + 1, r = right;
        while (l <= r) {
            if (nums[l] > pivot && nums[r] < pivot) {
                swap(nums, l, r);
                l++;
                r--;
            }
            if (nums[l] <= pivot) ++l;
            if (nums[r] >= pivot) --r;
        }
        swap(nums, left, r);
        return r;
    }

    public static void swap(int[] nums, int i , int j){
        int temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
    }
}
