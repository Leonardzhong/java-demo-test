package demo.core.leetcode;

/**
 * 顺时针旋转数组
 * leetcode 48
 *
 * @author leonard
 * @create 2023-02-15 21:39
 */
public class Rotate {

    public static void main(String[] args) {
        int[][] matrix = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};

        System.out.println("matrix before rotate:");

        printMatrix(matrix);

        rotate(matrix);

        System.out.println("matrix after rotate:");

        printMatrix(matrix);
    }

    private static void rotate(int[][] matrix) {
        int n = matrix.length;

        //水平翻转
        for (int i = 0; i < n / 2; i++) {
            for (int j = 0; j < n; j++) {
                int temp = matrix[i][j];
                matrix[i][j] = matrix[n - 1 - i][j];
                matrix[n - 1 - i][j] = temp;
            }
        }

        //主对角线翻转
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < i; j++) {
                int temp = matrix[i][j];
                matrix[i][j] = matrix[j][i];
                matrix[j][i] = temp;
            }
        }


    }

    //打印矩阵元素
    private static void printMatrix(int[][] matrix) {
        for (int i = 0; i < matrix.length; i++) {
            for (int j = 0; j < matrix[i].length; j++) {

                System.out.println("matrix element,i=" + i + ",j=" + j + ",matrix[i][j]=" + matrix[i][j]);

            }
        }
    }
}
