package demo.core.dailylearn;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Timer;
import java.util.TimerTask;

/**
 * @author zhongya
 * @date 2021/4/13 15:20
 */
public class JdkTimerStudy {

    public static void main(String[] args) {
        Timer timer = new Timer();
        TimerTask task = new TimerTask() {
            @Override
            public void run() {
                SimpleDateFormat simpleDateFormat = new SimpleDateFormat("HH:mm:ss");
                System.out.println(simpleDateFormat.format(new Date()) + ",executed");
                System.out.println(Thread.currentThread().getName());
            }
        };
        // System.out.println("single schedule");
        //timer.schedule(task, 1000);
        System.out.println("circular schedule");
        timer.schedule(task, 1000, 1000);
    }
}
