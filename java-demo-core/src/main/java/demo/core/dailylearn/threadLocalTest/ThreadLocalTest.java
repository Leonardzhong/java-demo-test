package demo.core.dailylearn.threadLocalTest;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * @author zhongya
 * @date 2021/4/25 11:19
 */
public class ThreadLocalTest {
    public static ExecutorService threadPool = Executors.newFixedThreadPool(10);
    //simpleDateFormat 非线程安全
    static SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    static final byte[] lock = new byte[0];

    public static void main(String[] args) throws InterruptedException {
        for (int i = 0; i < 10; i++) {
            int finalI = i;
            threadPool.submit(new Runnable() {
                @Override
                public void run() {
                    String date = date2(finalI);
                    System.out.println(date);
                }
            });
        }
        threadPool.shutdown();
    }

    public static String date(int seconds) {
        //参数的单位是毫秒，从1970.1.1 00:00:00 GMT计时
        Date date = new Date(1000 * seconds);
        String s = null;
        synchronized (ThreadLocalTest.class) {
            s = dateFormat.format(date);
        }
        return s;
    }

    public static String date2(int seconds) {
        //参数的单位是毫秒，从1970.1.1 00:00:00 GMT计时
        Date date = new Date(1000 * seconds);
        SimpleDateFormat dateFormat1 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        return dateFormat1.format(date);
    }

    public static String date1(int seconds) {
        Date date = new Date(1000 * seconds);
        String s = null;
        synchronized (lock) {
            s = dateFormat.format(date);
        }
        return s;
    }
}

