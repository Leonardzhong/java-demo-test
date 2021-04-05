package demo.core.learn.spring.annotation;

import demo.core.learn.spring.processor.MyFactoryBeanDefinitionRegistrar;
import org.springframework.context.annotation.Import;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

/**
 * @author leonard
 * @create 2021-04-04 00:14
 */
@Retention(RetentionPolicy.RUNTIME)
@Import(MyFactoryBeanDefinitionRegistrar.class)
public @interface MyMapperScan {

    String value() default "";
}
