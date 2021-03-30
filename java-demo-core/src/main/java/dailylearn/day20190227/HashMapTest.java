package dailylearn.day20190227;

import java.util.HashMap;
import java.util.Map;

/**
 * Demo
 *
 * @author zhongya
 * @date 2019/02/27
 */
public class HashMapTest {
    public static void main(String[] args) {
        Map<String, String> map0 = new HashMap<>(2);
        map0.put("1", "hello ");
        map0.put("2", "world");
        for (Map.Entry entry : map0.entrySet()) {
            System.out.println("key--" + entry.getKey() + "  value--"+entry.getValue());
        }

        HashMap<Integer,String> map = new HashMap<Integer,String>(2,0.75f);
            map.put(5, "C");
            new Thread("Thread1") {
                @Override
                public void run() {
                    map.put(7, "B");
                    System.out.println(map);
                }
            }.start();

            new Thread("Thread2") {
                @Override
                public void run() {
                    map.put(3, "A");
               System.out.println(map);
                }
            }.start();

        new Thread("Thread3") {
            @Override
            public void run() {
                map.put(4, "d");
                System.out.println(map);
            }
        }.start();


    }
}
