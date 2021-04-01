package demo.core.dailylearn.day1103;

import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

/**
 * Demo
 *
 * @author zhongya
 * @date 2018/09/14
 */
public class LockTest {
    private Lock lock = new ReentrantLock();

    private void method(Thread thread) {
        lock.lock();
        try {
            System.out.println("线程名：" + thread.getName() + "获得锁");
            Thread.sleep(2000);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            System.out.println("线程名：" + thread.getName() + "释放了锁");
            lock.unlock();
        }

    }

    private void method1(Thread thread) throws InterruptedException {
        //允许等待5s
        if (lock.tryLock(5, TimeUnit.SECONDS)) {
            try {
                System.out.println("线程名：" + thread.getName() + "获得锁");
                Thread.sleep(3000);
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                System.out.println("线程名：" + thread.getName() + "释放了锁");
                lock.unlock();
            }
        }

    }

    public static void main(String[] args) {
        final LockTest lockTest = new LockTest();
        Thread t1 = new Thread(new Runnable() {
            public void run() {
                try {
                    lockTest.method1(Thread.currentThread());
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }, "t1");
        Thread t2 = new Thread(new Runnable() {
            public void run() {
                try {
                    lockTest.method1(Thread.currentThread());
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }, "t2");
        t1.start();
        t2.start();

    }



}
