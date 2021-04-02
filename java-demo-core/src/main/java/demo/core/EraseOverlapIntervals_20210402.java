package demo.core;

/**
 * @author zhongya
 * @date 2021/4/2 16:26
 * 给定一个区间的集合，找到需要移除区间的最小数量，使剩余区间互不重叠。
 * <p>
 * 注意:
 * <p>
 * 可以认为区间的终点总是大于它的起点。
 * 区间 [1,2] 和 [2,3] 的边界相互“接触”，但没有相互重叠
 * <p>
 * 来源：力扣（LeetCode）
 * 链接：https://leetcode-cn.com/problems/non-overlapping-intervals
 * 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
 */
public class EraseOverlapIntervals_20210402 {

    public static void main(String[] args) {
        int[][] intervals = {{1, 2}, {2, 3}, {3, 4}, {1, 3}};
        System.out.println(eraseOverlapIntervals(intervals));

    }


    public static int eraseOverlapIntervals(int[][] intervals) {
        int m = intervals.length;
        int n = 2;
        int[][] erasedOverlapIntervals = new int[m][n];
        for(int i = 0; i < m; i++){
            int[] tmp = intervals[i];
            int left = tmp[0];
            int right = tmp[1];
            for(int j = 0; j < erasedOverlapIntervals.length; j++){
                int[] erased = erasedOverlapIntervals[j];
                if (erased[1] < left || erased[0] > right) {

                } else {

                }
            }
        }
        return 0;
    }

}
