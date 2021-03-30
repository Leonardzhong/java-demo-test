package dailylearn.day20181013;

import com.google.common.collect.Lists;

import java.util.Iterator;
import java.util.List;

/**
 * Demo
 *
 * @author zhongya
 * @date 2018/10/13
 */
public class TestConcurrentModificationException {

    public static void main(String[] args) {
        List<Integer> list = Lists.newArrayList();
        list.add(1);
        list.add(2);
        System.out.println(list);
        System.out.println("--------------------");
        Iterator<Integer> iterator = list.iterator();
        while (iterator.hasNext()) {
            Integer integer = iterator.next();
            if (integer == 1) {
               // list.remove(integer);
                iterator.remove();
            }
        }
        System.out.println(list);
    }
}
