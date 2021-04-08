package demo.core.learn.spring.dependencecircular;

import org.springframework.context.annotation.AnnotationConfigApplicationContext;

/**
 * @author leonard
 * @create 2021-04-06 21:08
 * 测试spring循环依赖
 */
public class TestMain {

    public static void main(String[] args) {
        AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(AppTestConfig.class);
        System.out.println("spring ApplicationContext start");
        //不清楚这里name="AService"？
        System.out.println(context.getBean("AService", AService.class));
        System.out.println(context.getBean("BService"));
    }
}
