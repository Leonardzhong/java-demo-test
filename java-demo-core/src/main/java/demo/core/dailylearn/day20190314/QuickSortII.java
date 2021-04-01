package demo.core.dailylearn.day20190314;

public class QuickSortII {
    //todo  this algorithm is not fully correct
    public static void main(String[] args) {
        int[] a = {4,5,3, 2, 1};
        int low = 0;
        int high = a.length-1;
        quickSort(a, low, high);
        for (int i:a){
            System.out.println(i);
        }
    }
    private static void quickSort(int[] a, int low, int high) {
        if (a == null || a.length <= 0 || low >= high) {
            return;
        }
        int pivot = partition(a, low, high);
        quickSort(a, low, pivot-1);
        quickSort(a, pivot + 1, high);
    }
    private static int partition(int[] nums, int left, int right) {
        int pivot = nums[left], l = left, r = right;
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
        return left;
    }

    public static void swap(int[] nums, int i , int j){
        int temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
    }
}
