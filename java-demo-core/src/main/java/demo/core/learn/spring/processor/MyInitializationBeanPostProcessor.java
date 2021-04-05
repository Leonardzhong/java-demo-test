package demo.core.learn.spring.processor;

import demo.core.learn.spring.annotation.MyValueInject;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.lang.reflect.*;

/**
 * @author leonard
 * @create 2021-04-05 21:41
 */
@Component
public class MyInitializationBeanPostProcessor implements BeanPostProcessor {
    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        if ("userService".equals(beanName)) {
            System.out.println("UserService初始化前方法执行");

            //测试PostConstruct注解
            for (Method method : bean.getClass().getMethods()) {
                if (method.isAnnotationPresent(PostConstruct.class)) {
                    try {
                        method.invoke(bean);
                    } catch (IllegalAccessException e) {
                        e.printStackTrace();
                    } catch (InvocationTargetException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
        return bean;
    }

    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        if ("userService".equals(beanName)) {
            System.out.println("BeanPostProcessor postProcessAfterInitialization UserService初始化后方法执行");
        }

        //利用bean后置处理器，动态注入注解传值
        Class<?> clazz = bean.getClass();
        for (Field field : clazz.getDeclaredFields()) {
            if (field.isAnnotationPresent(MyValueInject.class)) {
                MyValueInject fieldAnnotation = field.getAnnotation(MyValueInject.class);
                String value = fieldAnnotation.value();
                field.setAccessible(true);
                try {
                    field.set(bean, value);
                } catch (IllegalAccessException e) {
                    e.printStackTrace();
                }
            }
        }

        //初始化后方法应用（动态代理）
        if ("barService".equals(beanName)) {
            Object o = Proxy.newProxyInstance(bean.getClass().getClassLoader(), bean.getClass().getInterfaces(), new InvocationHandler() {
                @Override
                public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                    System.out.println("代理逻辑1");
                    method.invoke(bean, args);
                    System.out.println("代理逻辑2");
                    return null;
                }
            });
            return o;
        }
        return bean;
    }

}
