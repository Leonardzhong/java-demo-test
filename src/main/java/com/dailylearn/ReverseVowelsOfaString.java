package com.dailylearn;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

/**
 * Demo
 *
 * @author zhongya
 * @date 2019/03/17
 */
public class ReverseVowelsOfaString {
    public static Set<Character> vowels = new HashSet<>(Arrays.asList('a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U'));

    public static void main(String[] args) {
        String string = "A man, a plan, a canal: Panama";
        System.out.println(string);
        String res = reverseVowels(string);
        System.out.println(res);
        String ss = "hello";
        char[] chars = new char[]{'h', 'e', 'l', 'l', 'o'};
        if (ss.equals(Arrays.toString(chars))) {
            System.out.println("yes");
        } else {
            System.out.println("no");
        }
        System.out.println((int)(Math.sqrt(5)));
        char a = 'a';
        char A = 'A';
        char c = (char)(a + 'a' - 'A');
        System.out.println(a-A);
        System.out.println("----" + c);
    }

    private static String reverseVowels(String s) {
        if (s.length() == 1) {
            return s;
        }
        int l = s.length();
        char[] chars = new char[l];
        int low = 0;
        int high = l - 1;
        while (low <= high) {
            if (vowels.contains(s.charAt(low)) && vowels.contains(s.charAt(high))) {
                chars[high] = s.charAt(low);
                chars[low] = s.charAt(high);
                high--;
                low++;
            } else if (!vowels.contains(s.charAt(low))) {
                chars[low] = s.charAt(low);
                low++;
            } else if (!vowels.contains(s.charAt(high))) {
                chars[high] = s.charAt(high);
                high--;
            }
        }
        return new String(chars);
    }

}
