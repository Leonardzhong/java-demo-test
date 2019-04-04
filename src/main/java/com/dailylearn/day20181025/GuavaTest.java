package com.dailylearn.day20181025;

import com.google.common.base.Function;
import com.google.common.base.Objects;
import com.google.common.collect.*;
import com.google.common.primitives.Ints;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Demo
 *
 * @author zhongya
 * @date 2018/10/25
 */
public class GuavaTest {

    public static void main(String[] args) {
        CommonDTO commonDTO = new CommonDTO("123320", 10, 1232344343L);
        CommonDTO commonDTO1 = new CommonDTO("123321", 11, 1232344343L);
        CommonDTO commonDTO2 = new CommonDTO("123322", 12, 1232344343L);
        System.out.println(commonDTO.toString());
      //  System.out.println(Objects.toStringHelper(commonDTO).add("orderId", 32332).toString());

        Ordering byLengthOrdering = new Ordering() {
            @Override
            public int compare(Object left, Object right) {
                return Ints.compare(left.toString().length(), right.toString().length());
            }
        };

        System.out.println( byLengthOrdering.max(Lists.newArrayList("hi", "world")));

        System.out.println(byLengthOrdering.sortedCopy(Lists.newArrayList("hi", "world")));

        System.out.println("=============guava map======================");

        List<String> names = Lists.newArrayList("John", "Adam", "Tom");
        Function<String, Integer> func = new Function<String, Integer>() {
            @Override
            public Integer apply(String input) {
                return input.length();
            }
        };
        Multimap<Integer, String> groups = Multimaps.index(names, func);
        System.out.println(groups.entries());
        System.out.println(groups.get(4));
        System.out.println(groups.get(4));
        System.out.println(groups);

        System.out.println("---------end--------------------");
        List<CommonDTO> dtos = Lists.newArrayList(commonDTO, commonDTO1, commonDTO2);
        Map<String, CommonDTO> map = Maps.uniqueIndex(dtos, CommonDTO::getOrderId);
        System.out.println(map.entrySet());
        System.out.println("-=-=-=-=-=-===-=-===-=-=-=-=-=-");
        Map<Integer, CommonDTO> map1 = dtos.stream().collect(Collectors.toMap(CommonDTO::getOrderQuantity, dto -> dto));
        System.out.println(map1.entrySet());



    }



}
