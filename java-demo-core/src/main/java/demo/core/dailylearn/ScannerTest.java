package demo.core.dailylearn;

import java.util.Arrays;
import java.util.Scanner;

/**
 * @author leonard
 * @create 2021-07-05 21:09
 */
public class ScannerTest {

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int a;
        int[] b = new int[3];
        for (int i = 0; i < 3; i++) {
            a = in.nextInt();
            b[i] = a;
        }
        System.out.println(Arrays.toString(b));
    }
}
