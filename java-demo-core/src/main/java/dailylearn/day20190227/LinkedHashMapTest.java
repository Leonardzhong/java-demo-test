package dailylearn.day20190227;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Demo
 *
 * @author zhongya
 * @date 2019/02/27
 */
public class LinkedHashMapTest {

    public static void main(String[] args) {
        LinkedHashMap<String, String> lm = new LinkedHashMap<>(16, 0.75f, true);
        lm.put("key-1", "val-1");
        lm.put("key-2", "val-2");
        lm.put("key-3", "val-3");
        lm.put("key-4", "val-4");
        lm.get("key-2");
        for (Map.Entry<String, String> entry : lm.entrySet()) {
            System.out.println(entry.getKey() + "--" + entry.getValue());
        }
    }
}
