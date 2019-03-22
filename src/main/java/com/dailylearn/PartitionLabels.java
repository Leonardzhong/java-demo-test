package com.dailylearn;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Demo
 *input:"ababcbacadefegdehijhklij"
 *output: The partition is "ababcbaca", "defegde", "hijhklij".
 * @author zhongya
 * @date 2019/03/17
 */
public class PartitionLabels {

    public static void main(String[] args) {
        String S = "ababcbacadefegdehijhklij";
        List<Integer> res = partitionLabels(S);
        System.out.println(res);
    }

    private static List<Integer> partitionLabels(String S) {
        List<Integer> res = new ArrayList<>();
        Map<Character, Integer> map = new HashMap<>();
        int l = S.length();
        int start = 0;
        int end = 0;
        for(int i = 0; i < l; i++){
            map.put(S.charAt(i), i);
        }
        for (int i = 0; i < l; i++){
            end = map.get(S.charAt(i)) > end ? map.get(S.charAt(i)) : end;
            if (i == end) {
                res.add(end - start + 1);
                start = i + 1;
            }
        }
        return res;
    }
}
