package demo.core.learn.spring.dependencecircular;

import org.springframework.stereotype.Component;

import javax.annotation.Resource;

/**
 * @author leonard
 * @create 2021-04-06 21:07
 */
@Component
public class AService {

    @Resource
    private BService bService;
}
