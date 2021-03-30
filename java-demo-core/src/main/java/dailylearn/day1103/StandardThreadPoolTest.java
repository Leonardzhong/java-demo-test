package dailylearn.day1103;

import org.apache.commons.lang3.concurrent.BasicThreadFactory;

import java.util.concurrent.*;

/**
 * Demo
 *
 * @author zhongya
 * @date 2018/09/14
 */
public class StandardThreadPoolTest {
    public static void main(String[] args) {
        ScheduledExecutorService executorService = new ScheduledThreadPoolExecutor(1,
                new BasicThreadFactory.Builder().namingPattern("example-schedule-pool-%d").daemon(true).build());
        executorService.submit(() -> System.out.println("run"));


        ThreadFactory namedFactory = new BasicThreadFactory.Builder().build();
        ExecutorService pool = new ThreadPoolExecutor(5, 200, 0L, TimeUnit.SECONDS,
                new LinkedBlockingDeque<Runnable>(1024), namedFactory, new ThreadPoolExecutor.AbortPolicy());
        pool.execute(() -> System.out.println(Thread.currentThread().getName()));
        pool.shutdown();
    }
}
