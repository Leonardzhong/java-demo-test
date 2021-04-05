package demo.core.dailylearn.day1102_proxy.staticProxy;

/**
 * Created by zhongya on 2017/11/3.
 */
public class CountProxyTest {
    public static void main(String[] args) {
        CountImpl countImpl = new CountImpl();
        CountProxy countProxy = new CountProxy(countImpl);
        countProxy.queryCount();
        countProxy.updateCount();
    }


}
