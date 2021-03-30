package dailylearn.day20190721;
import java.lang.reflect.Method;


public class AnnotationTest {

    @Test
    public void testAdd() {
        System.out.println("test add method.");
    }

    @Test(ignore = true)
    public void testSubtract() {
        System.out.println("test subtract method.");
    }

    public static void main(String[] args) {
        AnnotationTest obj = new AnnotationTest();
        run(obj);
    }

    private static void run(AnnotationTest obj) {
        try {
            for (Method method : obj.getClass().getMethods()) {
                Test test = method.getDeclaredAnnotation(Test.class);
                if (test != null && !test.ignore()) {
                    method.invoke(obj);
                }
            }
        } catch (Exception ex) {
           // log.error("{}", Throwables.getStackTraceAsString(ex));
        }

    }
}
