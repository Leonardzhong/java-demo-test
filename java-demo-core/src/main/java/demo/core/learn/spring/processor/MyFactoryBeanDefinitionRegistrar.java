package demo.core.learn.spring.processor;

import demo.core.learn.spring.annotation.MyMapperScan;
import demo.core.learn.spring.dao.UserMapper;
import org.springframework.beans.factory.support.AbstractBeanDefinition;
import org.springframework.beans.factory.support.BeanDefinitionBuilder;
import org.springframework.beans.factory.support.BeanDefinitionRegistry;
import org.springframework.beans.factory.support.BeanNameGenerator;
import org.springframework.context.annotation.ImportBeanDefinitionRegistrar;
import org.springframework.core.type.AnnotationMetadata;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * @author leonard
 * @create 2021-04-03 23:55
 */
public class MyFactoryBeanDefinitionRegistrar implements ImportBeanDefinitionRegistrar {
    @Override
    public void registerBeanDefinitions(AnnotationMetadata importingClassMetadata, BeanDefinitionRegistry registry,
                                        BeanNameGenerator importBeanNameGenerator) {
        //通过注解扫描类
        Map<String, Object> annotationAttributes = importingClassMetadata.getAnnotationAttributes(MyMapperScan.class.getName());
        System.out.println("annotationAttributes=" + annotationAttributes.values());
        //todo

        //手动添加mapper
        List<Class> mappers = new ArrayList<>();
        mappers.add(UserMapper.class);

        //注册beaDefinition
        for (Class mapper : mappers) {
            BeanDefinitionBuilder builder = BeanDefinitionBuilder.genericBeanDefinition();
            AbstractBeanDefinition beanDefinition = builder.getBeanDefinition();

            beanDefinition.setBeanClass(MyFactoryBean.class);
            beanDefinition.getConstructorArgumentValues().addGenericArgumentValue(mapper);

            registry.registerBeanDefinition(mapper.getSimpleName(), beanDefinition);
        }
    }
}
