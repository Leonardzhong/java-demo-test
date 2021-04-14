package demo.core.dailylearn;


import java.util.Random;
import java.util.concurrent.*;

/**
 * @author zhongya
 * @date 2021/4/14 12:17
 */
public class FutureStudy {

    public static void main(String[] args) throws ExecutionException, InterruptedException {

        FutureTask<Integer> futureTask = new FutureTask<>(new MyTask());
        //自定义线程池创建
        ExecutorService executorService = new ThreadPoolExecutor(2, 5, 100,
                TimeUnit.MILLISECONDS, new LinkedBlockingQueue<>(1000), Executors.defaultThreadFactory(),
                new ThreadPoolExecutor.AbortPolicy());
        try {
            //提交任务
            executorService.submit(new MyTask());

            //获取执行结果
            System.out.println(futureTask.get());
        } finally {

            //关闭线程池
            executorService.shutdown();
        }


    }

    public static class MyTask implements Callable<Integer> {
        @Override
        public Integer call() {
            return new Random().nextInt();
        }
    }
}
