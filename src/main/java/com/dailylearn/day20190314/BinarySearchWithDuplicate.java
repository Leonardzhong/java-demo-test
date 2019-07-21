package com.dailylearn.day20190314;

public class BinarySearchWithDuplicate {

    public static void main(String[] args) {
        int[] nums = {1, 1, 2, 4};
        int target = 1;
        int index = binarySearchLeft(nums, target);
        //int index = binarySearchRight(nums, target);
        System.out.println(index);
    }

    private static int binarySearchLeft(int[] arr, int target) {
        if (arr == null || arr.length == 0) {
            return -1;
        }
        int left = 0;
        int right = arr.length - 1;
        while (left < right) {
            int mid = (left + right) / 2;
            if (arr[mid] < target) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        if (arr[right] == target) {
            return right;
        }
        return -1;

    }

    public static int binarySearchRight(int[] arr, int target) {
        if (arr == null || arr.length == 0) {
            return -1;
        }
        int left = 0;
        int right = arr.length - 1;
        while (left < right) {
            int mid = (left + right) / 2;
            if (arr[mid] <= target) {
                left = mid;
            } else {
                right = mid - 1;
            }
        }
        if (arr[left] == target) {
            return left;
        }
        return -1;
    }
}

