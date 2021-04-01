package demo.core.dailylearn.day20180922;

/**
 * Demo
 *
 * @author zhongya
 * @date 2018/09/22
 */
public class SaleOrderDispatchServiceImpl extends AbstractDispatchService implements DispatchService,AppointService{

    @Override
    public void dispatchCommonOrder() {
        System.out.println("this is sale order dispatch");
        commonDispatch();
    }

    @Override
    public void operateBeforeDispatch() {
        System.out.println("this is operation before sale order dispatch");
        System.out.println("Note"+ COMMON_DISPATCH_LINE);
    }

    @Override
    public void operateAfterDispatch() {
        System.out.println("this is operation after sale order dispatch");
    }

    @Override
    public void appointBeforeDispatch() {
        System.out.println("this is appointment operation before dispatch");
    }
}
