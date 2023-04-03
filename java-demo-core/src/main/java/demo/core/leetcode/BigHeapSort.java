package demo.core.leetcode;

import java.util.Arrays;

/**
 * 构建大顶堆，实现升序排序
 *
 * @author leonard
 * @create 2023-03-31 11:31
 */
public class BigHeapSort {

    public static int temp = 0;


    public static void main(String[] args) {
        int[] num = {1, 4, 5, 3, 8, 2, 6, 9, 5};
        sort(num, num.length);
        System.out.println("-------" + Arrays.toString(num));

    }

    /**
     * 1.先将无序的数组调整成大顶堆
     * 2.将堆顶和最后一个元素交换
     * 3.将前 n-1 个元素再进行大顶堆调整，再交换
     */

    //完整的堆排序过程
    public static void sort(int[] arr, int len) {
        //先将原来的数组t调整成大顶堆
        for (int i = (arr.length / 2) - 1; i >= 0; i--) { //从编号最大的非叶子结点开始，length/2-1,
            sortHeap(arr, i, arr.length);
        }
        //交换和调整
        for (int i = len - 1; i > 0; i--) {    //下标从 0开始，所以长度要 减去1 ，循环 n-1次（1.交换 2.调整）
            swap(arr, 0, i);        //堆顶元素与末尾元素进行交换
            sortHeap(arr, 0, i);  //交换后重新调整
        }
    }

    //调整成大顶堆
    private static void sortHeap(int[] arr, int i, int length) {
        temp = arr[i];                         //暂存树的根节点
        for (int k = i * 2 + 1; k < length; k = k * 2 + 1) {     //
            if (k + 1 < length && arr[k] < arr[k + 1]) {   //只有小于length的情况下才有右子节点，比较左右节点
                k++;      //如果右节点更大，则 k 指向右节点
            }
            if (arr[k] > temp) {    //左子节点或者右子节点如果大于temp
                arr[i] = arr[k];  //将较大的子节点与正在处理的根节点互换
                i = k;    //
            } else {
                break;
            }
        }
        arr[i] = temp;
    }

    //交换
    private static void swap(int[] arr, int i, int j) {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
}
