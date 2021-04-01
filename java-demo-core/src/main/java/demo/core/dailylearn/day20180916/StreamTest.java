package demo.core.dailylearn.day20180916;

import com.google.common.collect.ImmutableList;
import com.google.common.collect.Lists;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Demo
 *
 * @author zhongya
 * @date 2018/09/16
 */
public class StreamTest {
    public static void main(String[] args) {
        List<String> lista = Lists.newArrayList("hello", "world");
        List<String> listb = Lists.newArrayList("hello", "java");
        Stream<String> combinedStream = Stream.concat(lista.stream(), listb.stream());
        List<String> listString = combinedStream.collect(Collectors.toList());
        System.out.println(listString);

        Stream<String> combinedStream1 = Stream.of(lista, listb).flatMap(List :: stream);
        List<String> listString1 = combinedStream1.collect(Collectors.toList());
        System.out.println("------------------");
        System.out.println(listString1);
        System.out.println("hello".equals(listString1.get(0)));

        List<String> listc = ImmutableList.of("a", "b", "c", "d");
        List<String> listd = ImmutableList.of("c", "d", "e", "f");
        List<String> listMerged = Stream.of(listc, listd)
                .flatMap(Collection::stream)
                .collect(Collectors.toList());
        System.out.println(listMerged);
        List<String> listMergedWithoutDuplicate = Stream.of(listc,listd)
                .flatMap(Collection::stream)
                .distinct()
                .collect(Collectors.toList());
        System.out.println(listMergedWithoutDuplicate);
    }
}
