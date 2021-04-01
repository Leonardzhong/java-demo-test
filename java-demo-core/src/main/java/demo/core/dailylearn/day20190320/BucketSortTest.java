package demo.core.dailylearn.day20190320;

/**
 * Demo
 *
 * @author zhongya
 * @date 2019/03/20
 */
public class BucketSortTest {
        public static void main(String[] args) {
            testBucketsSort();
        }

        private static void testBucketsSort(){
            int[] array = {5,7,3,5,4,8,6,4,1,2};
            BucketSort bs = new BucketSort(10, array);
            bs.sort();
            bs.sortOut();//输出打印排序
        }
}
