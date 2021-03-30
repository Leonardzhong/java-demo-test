package dailylearn.day20180922;

/**
 * Demo
 *
 * @author zhongya
 * @date 2018/09/22
 */
public class TestAbstractClass {
    public static void main(String[] args) {
        SaleOrderDispatchServiceImpl service = new SaleOrderDispatchServiceImpl();
        ReturnOrderDispatchServiceImpl dispatchService = new ReturnOrderDispatchServiceImpl();
        service.appointBeforeDispatch();
        service.commonDispatch();
        service.operateBeforeDispatch();
        service.dispatchCommonOrder();
        service.operateAfterDispatch();
        dispatchService.commonDispatch();
    }
}
