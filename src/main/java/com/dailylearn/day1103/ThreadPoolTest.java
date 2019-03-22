package com.dailylearn.day1103;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * Demo
 *
 * @author zhongya
 * @date 2018/09/14
 */
public class ThreadPoolTest {
    public static void main(String[] args) {
        ExecutorService executorService = Executors.newFixedThreadPool(1);
        executorService.submit(() -> System.out.println("run"));
        ScheduledExecutorService scheduledExecutorService = Executors.newScheduledThreadPool(1);
        scheduledExecutorService.scheduleAtFixedRate(() -> System.out.println("schedule"),
                0, 1, TimeUnit.SECONDS);
        executorService.shutdown();
        scheduledExecutorService.shutdown();
    }
}
