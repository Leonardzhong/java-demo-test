package demo.core.dailylearn.day1102_proxy.cglibdynamicproxy;

/**
 * Created by zhongya on 2017/11/3.
 * @author
 */
public class BookFacadeCglibTest {
    public static void main(String[] args) {
        BookFacadeImpl bookFacadeImpl = new BookFacadeImpl();
        BookFacadeCglib bookFacadeCglib = new BookFacadeCglib();
        BookFacadeImpl bookCglib = (BookFacadeImpl) bookFacadeCglib.getInstance(bookFacadeImpl);
        bookCglib.addBook();
    }

}
