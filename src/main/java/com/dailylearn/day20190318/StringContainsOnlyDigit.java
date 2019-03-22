package com.dailylearn.day20190318;

/**
 * Demo
 *
 * @author zhongya
 * @date 2019/03/18
 */
public class StringContainsOnlyDigit {
    public static void main(String[] args) {
        String s = "12";
        if (onlyDigitString(s)) {
            System.out.println("yes");
            return;
        }
        System.out.println("no");
        System.out.println("-------" + "1".length());
    }

    private static boolean onlyDigitString(String s) {
        return s.trim().matches("[0-9]+");
    }
}
