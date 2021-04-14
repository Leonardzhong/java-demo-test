package demo.core.dailylearn;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.*;

/**
 * @author zhongya
 * @date 2021/4/14 11:37
 */
public class ScheduleExecutorStudy {
    static SimpleDateFormat simpleDateFormat = new SimpleDateFormat("HH:mm:ss");

    public static void main(String[] args) throws ExecutionException, InterruptedException {
        fixScheduleRate();
        //scheduleCallable();
    }

    private static void scheduleCallable() throws InterruptedException, ExecutionException {
        ScheduledExecutorService executorService = Executors.newScheduledThreadPool(3);
        ScheduledFuture<String> scheduledFuture = executorService.schedule(() -> {
            try {
                Thread.sleep(3000L);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("task execute finish time:" + simpleDateFormat.format(new Date()));
            return "task execute success";
        }, 1000L, TimeUnit.MILLISECONDS);

        System.out.println("Callable future's result is:" + scheduledFuture.get() +
                ", schedule start time:" + simpleDateFormat.format(new Date()));
    }

    private static void fixScheduleRate() {

        ScheduledExecutorService executorService = Executors.newScheduledThreadPool(5);
        executorService.scheduleAtFixedRate(() ->
        {
            try {
                Thread.sleep(3000L);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("task execute finish time:" + simpleDateFormat.format(new Date()));

        }, 1000L, 1000L, TimeUnit.MILLISECONDS);

        System.out.println("schedule start time:" + simpleDateFormat.format(new Date()));
    }


}
