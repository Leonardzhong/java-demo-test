package demo.core.learn.spring.service;

import org.springframework.stereotype.Component;

/**
 * @author leonard
 * @create 2021-04-05 23:41
 */
@Component
public class BarService implements Bar{

    @Override
    public void test() {
        System.out.println("BarService业务逻辑");
    }
}
