package demo.core.dailylearn.day1102_proxy.cglibdynamicproxy;


import net.sf.cglib.proxy.Enhancer;
import net.sf.cglib.proxy.MethodInterceptor;
import net.sf.cglib.proxy.MethodProxy;

import java.lang.reflect.Method;

/**
 * Created by zhongya on 2017/11/3.
 * @author  jj
 * */
public class BookFacadeCglib implements MethodInterceptor{

    private  Object target;

    public Object getInstance(Object target) {
        this.target = target;
        Enhancer enhancer = new Enhancer();
        enhancer.setSuperclass(this.target.getClass());
        enhancer.setCallback(this);
        return enhancer.create();
    }

    @Override
    public Object intercept(Object o, Method method, Object[] objects, MethodProxy methodProxy) throws Throwable {
        System.out.println("预处理操作。。。");
        methodProxy.invokeSuper(o, objects);
        System.out.println("调用方法后的操作。。。");
        return null;
    }
}
