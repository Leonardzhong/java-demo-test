package demo.core.learn.spring.service;

import demo.core.learn.spring.entity.User;
import demo.core.learn.spring.dao.UserMapper;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.BeanFactoryAware;
import org.springframework.beans.factory.BeanNameAware;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;

/**
 * @author leonard
 * @create 2021-04-03 15:36
 */

@Component
public class UserService implements Foo, BeanNameAware, BeanFactoryAware, ApplicationContextAware, InitializingBean {

    @Resource
    private User user;

    private String beanName;

    @Resource
    private UserMapper userMapper; //mybatis代理对象


    public void getUserById(Long id) {
        System.out.println("userMapper=" + userMapper);
        userMapper.getUserById(id);
    }

    @Override
    public void getName(String name) {
        System.out.println("user name is:" + name);
    }

    @Override
    public void setBeanName(String name) {
        this.beanName = name;
    }

    @Override
    public void setBeanFactory(BeanFactory beanFactory) throws BeansException {

    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {

    }

    @Override
    public void afterPropertiesSet() throws Exception {

    }
}
