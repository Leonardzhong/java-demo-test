package dailylearn.day1102.jdkdynamicproxy;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;

/**
 * Created by zhongya on 2017/11/3.
 */
public class BookFacadeProxy implements InvocationHandler {

    private Object target;

    public Object bind(Object target) {
        this.target = target;
        return Proxy.newProxyInstance(target.getClass().getClassLoader(), target.getClass().getInterfaces(), this);
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        Object result;
        System.out.println("预处理操作...");
        result = method.invoke(target, args);
        System.out.println("调用后处理...");
        return result;
    }
}
