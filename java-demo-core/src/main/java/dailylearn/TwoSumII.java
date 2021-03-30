package dailylearn;

/**
 * Demo
 *
 * @author zhongya
 * @date 2019/03/17
 */
public class TwoSumII {
    public static void main(String[] args) {
        int[] numbers = new int[]{2, 3, 4};
        int target = 6;
        int[] res;
        res = twoSum(numbers, target);
        for (int i : res) {
            System.out.println(i);
        }
    }

    private static int[] twoSum(int[] numbers, int target) {
        int[] res = new int[2];
        int l = numbers.length;
        int low = 0;
        int high = l - 1;
        while (low < high) {
            if (target - numbers[low] < numbers[high]) {
                high--;
            } else if (target - numbers[low] > numbers[high]) {
                low++;
            } else {
                low++;
                high++;
                res[0] = low;
                res[1] = high;
                break;
            }
        }
        return res;
    }
}

