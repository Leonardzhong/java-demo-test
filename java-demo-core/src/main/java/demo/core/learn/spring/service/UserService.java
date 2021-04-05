package demo.core.learn.spring.service;

import demo.core.learn.spring.annotation.MyValueInject;
import demo.core.learn.spring.dao.UserMapper;
import demo.core.learn.spring.entity.User;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.BeanFactoryAware;
import org.springframework.beans.factory.BeanNameAware;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
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

    @MyValueInject("myBeanPostProcessor")
    private String myValue;

    @Resource
    private UserMapper userMapper; //mybatis代理对象

    @Autowired
    private void setUser(User user) {
        System.out.println("userService set方法注入");
        this.user = user;
    }

    public UserService() {
        System.out.println("userService无参构造方法实例化执行");
    }

    public UserService(User user, String beanName, String myValue, UserMapper userMapper) {
        this.user = user;
        this.beanName = beanName;
        this.myValue = myValue;
        this.userMapper = userMapper;
        System.out.println("userService全参数构造方法执行");
    }

    public void getMyValue() {
        System.out.println("myValue=" + this.myValue);
    }
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
        System.out.println("InitializingBean afterPropertiesSet 初始化方法执行");
    }

    @PostConstruct
    public void testPostConstruct() {  //实际上是在postProcessBeforeInitialization方法中解析注解
        System.out.println("PostConstruct 初始化方法执行");
    }
}
