package demo.core.leetcode;

public class MergeSort {

    public static void main(String[] args) {
        int[] nums = new int[]{-1, 0, 8, 4, 2, 9, 10, 2};
        mergeSort(nums, 0, nums.length - 1);
        for (int i = 0; i < nums.length; i++) {
            System.out.println(nums[i]);
        }
    }

    private static void mergeSort(int[] nums, int left, int right) {
        if (left >= right) {
            return;
        }
        int mid = left + (right - left) / 2;
        mergeSort(nums, left, mid);
        mergeSort(nums, mid + 1, right);
        merge(nums, left, mid, right);
    }

    private static void merge(int[] nums, int left, int mid, int right) {
        int[] tmp = new int[nums.length];
        int r1 = mid + 1;
        int tIndex = left;
        int cIndex = left;
        while (left <= mid && r1 <= right) {
            if (nums[left] <= nums[r1]) {
                tmp[tIndex++] = nums[left++];
            } else {
                tmp[tIndex++] = nums[r1++];
            }
        }

        while (left <= mid) {
            tmp[tIndex++] = nums[left++];
        }
        while (r1 <= right) {
            tmp[tIndex++] = nums[r1++];
        }

        while (cIndex <= right) {
            nums[cIndex] = tmp[cIndex];
            cIndex++;
        }
    }


}
