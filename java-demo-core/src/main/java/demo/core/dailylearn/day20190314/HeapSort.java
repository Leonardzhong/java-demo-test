package demo.core.dailylearn.day20190314;


/**
 * Demo
 * heapSort algorithm
 *
 * @author zhongya
 * @date 2019/03/14
 */
public class HeapSort {


    public static void main(String[] args) {
        int[] num = {1, 4, 5, 3, 8, 2, 6, 9};
        printNum(num);
        heapSort(num);
        System.out.println("-------");
        printNum(num);
    }

    private static void heapSort(int[] num) {
        buildHeap(num);
        int l = num.length;
        for (int j = l - 1; j > 0; j--) {
            swap(num, 0, j);
            heapify(num, 0, j);
        }
    }

    private static void buildHeap(int[] num) {
        for (int i = num.length / 2 - 1; i >= 0; i--) {
            heapify(num, i, num.length);
        }
    }

    private static void heapify(int[] num, int i, int length) {
        int l = 2 * i + 1;
        int r = 2 * i + 2;
        int max = 0;
        if (l < length && num[l] > num[i]) {
            max = l;
        }else if (r < length && num[r] > num[i]) {
            max = r;
        }else {
            max = i;
        }
        if (max != i) {
            swap(num, i, max);
            heapify(num, max, length);
        }
    }

    private static void swap(int[] num, int i, int max) {
        int tmp = num[max];
        num[max] = num[i];
        num[i] = tmp;

    }

    private static void printNum(int[] num) {
        if (num == null || num.length < 1) {
            return;
        }
        for (int n : num) {
            System.out.print(n + " ");
        }
    }
}
