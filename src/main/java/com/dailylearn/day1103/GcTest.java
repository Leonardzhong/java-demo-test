package com.dailylearn.day1103;

import java.util.HashMap;
import java.util.Map;

/**
 * Demo
 *
 * @author zhongya
 * @date 2018/09/14
 */
public class GcTest {
    /**
     * 全局变量
     */
    private static Map leafMap = new HashMap();

    public static void main(String[] args) {

            int i = 0;
            while(true){
                byte[] bytes = new byte[1024*1024];
//            String s = bytes.toString();
                leafMap.put((i++)+"", bytes);
//            WeakReference<byte[]> weakbytes = new WeakReference<byte[]>(bytes);
//            leafMap.put((i++)+"", weakbytes);
                System.out.println(i+"");
                bytes = null;//可有可无
            }
    }
}
