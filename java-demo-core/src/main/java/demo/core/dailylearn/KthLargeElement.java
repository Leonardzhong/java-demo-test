package demo.core.dailylearn;

import java.util.PriorityQueue;

public class KthLargeElement {
    public static void main(String[] args) {
        int[] nums = {99, 99};
        int k = 1;
        int res = findKthLargest(nums, k);
        System.out.println(res);
    }

    private static int findKthLargest(int[] nums, int k) {
        PriorityQueue<Integer> heapQueue = new PriorityQueue<>();
        for(int num : nums){
            heapQueue.add(num);
            if(num > k) heapQueue.poll();
        }
        return heapQueue.peek();
    }
}
