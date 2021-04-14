package demo.core.leetcode;

/**
 * Demo
 * quickSort algorithm
 *
 * @author zhongya
 * @date 2019/03/14
 */
public class QuickSort {

    public static void main(String[] args) {
        int[] a = new int[]{3, 2, 1};
        quickSort(a, 0, a.length - 1);
        print(a);
    }

    private static void print(int[] a) {
        for (int tmp : a) {
            System.out.print(tmp + " ");
        }
    }

    private static void quickSort(int[] a, int low, int high) {
        if (a == null || a.length <= 0 || low >= high) {
            return;
        }
        int pivot = partition(a, low, high);
        quickSort(a, low, pivot);
        quickSort(a, pivot + 1, high);
    }

    private static int partition(int[] a, int low, int high) {
        int pivot = a[low];
        while (low < high) {
            while (low < high && a[high] > pivot) {
                high--;
            }
            if (low < high) {
                a[low] = a[high];
                low++;
            }
            while (low < high && a[low] < pivot) {
                low++;
            }
            if (low < high) {
                a[high] = a[low];
                high--;
            }
        }
        a[low] = pivot;
        return low;
    }

}
