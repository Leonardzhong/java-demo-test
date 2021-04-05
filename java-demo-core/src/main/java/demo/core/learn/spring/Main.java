package demo.core.learn.spring;

import demo.core.learn.spring.service.UserService;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

/**
 * @author leonard
 * @create 2021-04-03 15:37
 */
public class Main {

    public static void main(String[] args) {
        AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);
        UserService userService = context.getBean("userService", UserService.class);
        userService.getName("leonard");
        userService.getUserById(1L);

    }
}
