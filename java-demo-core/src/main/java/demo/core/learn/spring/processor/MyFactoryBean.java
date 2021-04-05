package demo.core.learn.spring.processor;

import org.springframework.beans.factory.FactoryBean;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;

/**
 * @author leonard
 * @create 2021-04-03 18:31
 */
//note: 这里不能加注解
//@Component
public class MyFactoryBean implements FactoryBean {

    private Class mapper;

    public MyFactoryBean(Class mapper) {
        this.mapper = mapper;
    }

    @Override
    public Object getObject() throws Exception {

        Object o = Proxy.newProxyInstance(MyFactoryBean.class.getClassLoader(),
                new Class[]{mapper}, new InvocationHandler() {
                    @Override
                    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                        System.out.println("MyFactoryBean.getObject=" + method.getName());
                        return null;
                    }
                });
        return o;
    }

    @Override
    public Class<?> getObjectType() {
        return mapper;
    }
}
