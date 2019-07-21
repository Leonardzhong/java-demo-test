package day20190627;


import java.util.ArrayList;
import java.util.concurrent.*;

public class TaskWithResult implements Callable<String> {

    private int id;

    private TaskWithResult(int id) {
        this.id = id;
    }

    @Override
    public String call() throws Exception{
        return "result of TaskWithResult" + id;
    }

    public static void main(String[] args) {
        ExecutorService exec = Executors.newCachedThreadPool();
        ArrayList<Future<String>> results = new ArrayList<>();

        for (int i = 0; i < 10; i++)
            results.add(exec.submit(new TaskWithResult(i)));
        exec.shutdown();

        for (Future<String> future : results) {
            try {
                System.out.println(future.get());
            } catch (InterruptedException | ExecutionException e) {
                e.printStackTrace();
            }
        }
    }

}