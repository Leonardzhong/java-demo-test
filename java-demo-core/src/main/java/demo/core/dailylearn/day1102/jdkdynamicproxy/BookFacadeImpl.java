package demo.core.dailylearn.day1102.jdkdynamicproxy;

/**
 * Created by zhongya on 2017/11/3.
 */
public class BookFacadeImpl implements BookFacade {

    @Override
    public void addBook() {
        System.out.println("增加图书的方法...，测试JDK 动态代理");
    }
}
