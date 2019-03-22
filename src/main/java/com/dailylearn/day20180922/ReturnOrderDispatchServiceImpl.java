package com.dailylearn.day20180922;

/**
 * Demo
 *
 * @author zhongya
 * @date 2018/09/22
 */
public class ReturnOrderDispatchServiceImpl extends AbstractDispatchService implements DispatchService{

    @Override
    protected void operateBeforeDispatch() {

    }

    @Override
    protected void operateAfterDispatch() {
        System.out.println("this is operation after dispatch");
    }

    @Override
    public void dispatchCommonOrder() {
        System.out.println("hello java");
    }

     @Override
     public void commonDispatch() {
        System.out.println("this is a return order operation of dispatch------");
    }
}
