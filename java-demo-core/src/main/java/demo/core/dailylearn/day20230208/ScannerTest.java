package demo.core.dailylearn.day20230208;

import java.util.Scanner;

/**
 * @author leonard
 * @create 2023-02-08 07:29
 */
public class ScannerTest {

    public static void main(String[] args) {

       // func1();

       // func2();

       // func3();

        func4();

    }

    //测试nextLine
    private static void func4() {
        Scanner scanner = new Scanner(System.in);

        if (scanner.hasNextLine()) {
            String string = scanner.nextLine();
            System.out.println("输入的数据为：" + string);
        }
    }

    //测试next
    private static void func3() {
        Scanner scanner = new Scanner(System.in);

        if (scanner.hasNext()) {
            String string = scanner.next();

            System.out.println("输入的数据为：" + string);

        }
    }

    //输入多组数字，直到达到组数
    private static void func2() {
        Scanner scanner = new Scanner(System.in);

        int n = scanner.nextInt();

        while (n > 0) {
            int a = scanner.nextInt();

            int b = scanner.nextInt();

            int sum = a + b;

            System.out.println(sum);

            n--;
        }
    }

    //一直输入整数，直到非整数
    private static void func1() {
        Scanner scanner = new Scanner(System.in);

        while (scanner.hasNext()) {
            int a = scanner.nextInt();
            int b = scanner.nextInt();

            System.out.println(a + b);
        }
    }
}
