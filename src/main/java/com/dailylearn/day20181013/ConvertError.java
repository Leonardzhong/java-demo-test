package com.dailylearn.day20181013;

/**
 * Demo
 *
 * @author zhongya
 * @date 2018/10/13
 */
public class ConvertError {
    public static void main(String[] args) {
        Integer a = 128;
        //byte 数据溢出
        System.out.println(a.byteValue());
    }
}
