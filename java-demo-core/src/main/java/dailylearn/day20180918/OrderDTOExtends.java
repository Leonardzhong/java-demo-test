package dailylearn.day20180918;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * Demo
 *
 * @author zhongya
 * @date 2018/09/19
 */
@Data
@ToString(callSuper = true)
@NoArgsConstructor
public class OrderDTOExtends extends OrderDTO{

    private String productionNo;
    @Builder
    private OrderDTOExtends(String orderNo, Integer quantity, String orderType, String productionNo) {
        super(orderNo, quantity, orderType);
        this.productionNo = productionNo;
    }
}
