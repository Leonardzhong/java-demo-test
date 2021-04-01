package demo.core.dailylearn.day20190314;

import java.util.Arrays;

public class QuickSortIII {

    public static void main(String[] args) {
        int[] arr=new int[]{9,8,7,6,5,4,3,2,1,10};
        int low=0;
        int high=arr.length-1;
        quickSort(arr,low,high);
    }

    public static void quickSort(int[] arr,int low,int high){
        if(low>=high) return;
        int start=low;
        int end=high;

        int pivot=arr[low];
        while(low<high){
            while(low<high&&pivot<=arr[high]){
                high--;
            }
            arr[low]=arr[high];

            while(low<high&&pivot>=arr[low]){
                low++;
            }
            arr[high]=arr[low];
        }
        arr[low]=pivot;
        disp(arr);


        quickSort(arr,start,low-1);
        quickSort(arr,low+1,end);
    }

    public static void disp(int[] arr){
        System.out.println(Arrays.toString(arr));
    }

}
