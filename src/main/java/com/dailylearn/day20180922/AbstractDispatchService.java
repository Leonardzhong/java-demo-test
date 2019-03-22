package com.dailylearn.day20180922;

/**
 * Demo
 *
 * @author zhongya
 * @date 2018/09/22
 */
public abstract class AbstractDispatchService {

    /**
     * hello
     */
    protected abstract void  operateBeforeDispatch();

    void commonDispatch() {
        System.out.println("this is a common operation of dispatch");
    }

    /**
     * hello
     */
    protected abstract void operateAfterDispatch();
}
