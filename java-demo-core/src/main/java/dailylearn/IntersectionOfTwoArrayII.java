package dailylearn;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

public class IntersectionOfTwoArrayII {
    public static void main(String[] args) {
        int[] nums1 = new int[]{4,9,5};
        int[] nums2 = new int[]{9,4,9,8,4};
        int[] res = (intersect(nums1, nums2));
        for (int i : res){
            System.out.println(i);
        }

    }
    private static int[] intersect(int[] nums1, int[] nums2) {
        int[] res = new int[nums2.length];
        int i = 0;
        Map<Integer, Integer> map = new HashMap<>();
        for (int num : nums1){
            int count = 1;
            if(map.containsKey(num)){
                count = map.get(num);
                count++;
            }
            map.put(num, count);
        }
        for(int num : nums2){
            if(map.containsKey(num)){
                int count = map.get(num);
                if(count > 0){
                    res[i++] = num;
                    count--;
                    map.put(num, count);
                }
            }
        }
        return Arrays.copyOf(res, i);
    }
}
