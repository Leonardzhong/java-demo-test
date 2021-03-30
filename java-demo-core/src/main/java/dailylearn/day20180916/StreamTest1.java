package dailylearn.day20180916;

import com.google.common.collect.Lists;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Demo
 *
 * @author zhongya
 * @date 2018/09/16
 */
public class StreamTest1 {
    public static void main(String[] args) {
        List<Integer> list = Lists.newArrayList(7,1, null, 3, 6, 5, 2);
        Stream<Integer> stream = list.stream().filter(Objects::nonNull);
        Optional<Integer> min = stream.min(Integer::compareTo);
        min.ifPresent(System.out::println);

        System.out.println("----max-------");
        Optional<Integer> max = list.stream().filter(Objects::nonNull).max(Integer::compareTo);
        max.ifPresent(System.out::println);

        System.out.println("------sorted------");
        Stream<Integer> sorted = list.stream().filter(Objects::nonNull).sorted();
        List<Integer> listSorted = sorted.collect(Collectors.toList());
        System.out.println(listSorted);


    }

}
