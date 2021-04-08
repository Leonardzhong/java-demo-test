package demo.core.learn.spring.dependencecircular;

import org.springframework.stereotype.Component;

import javax.annotation.Resource;

/**
 * @author leonard
 * @create 2021-04-06 21:08
 */
@Component
public class BService {

    @Resource
    private AService aService;
}
