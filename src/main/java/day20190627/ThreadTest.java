package day20190627;


import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

public class ThreadTest implements Runnable{

        private List<String> list;

        private ThreadTest(List<String> list) {
            this.list = list;
        }

        @Override
        public void run() {
            for (String target : list) {
                System.out.println(target);
                try {
                    TimeUnit.MILLISECONDS.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }

        public static void main(String[] args) {
            List<String> list = new ArrayList<>();
            list.add("杨过");
            list.add("小龙女");
            list.add("梅超风");
            Thread thread1 = new Thread(new ThreadTest(list));
            thread1.start();
        }
}
