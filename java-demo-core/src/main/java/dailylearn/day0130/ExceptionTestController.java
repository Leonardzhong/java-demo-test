package dailylearn.day0130;


public class ExceptionTestController {

    public static void main(String[] args) throws Exception {

        String res = null;
            res = nullPointerException();
        System.out.println("hello world!");
        System.out.println(res);
    }

    private static String nullPointerException() throws Exception{
        String string = null;
        try {
            string = getString(string);
        } catch (Exception e) {
 //           e.printStackTrace();
            System.out.println(e.toString());
 //         System.out.println(e.getMessage());
            throw new Exception("要新建一个异常才能抛出");
        }
        System.out.println("会执行这里吗？");
        return string;
    }

    private static String getString(String string) {

        return string.toString();
    }
}
