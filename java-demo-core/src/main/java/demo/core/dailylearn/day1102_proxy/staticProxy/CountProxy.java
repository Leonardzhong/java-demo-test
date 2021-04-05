package demo.core.dailylearn.day1102_proxy.staticProxy;

/**
 * Created by zhongya on 2017/11/3.
 */
public class CountProxy implements Count {

    private CountImpl countImpl;

    public CountProxy(CountImpl countImpl) {
        this.countImpl = countImpl;
    }

    public void queryCount() {
        System.out.println("查询账户的预处理...");
        countImpl.queryCount();
        System.out.println("查询账户之后的处理...");
    }

    public void updateCount() {
        System.out.println("更新账户的预处理...");
        countImpl.updateCount();
        System.out.println("更新账户之后的处理...");
    }
}
