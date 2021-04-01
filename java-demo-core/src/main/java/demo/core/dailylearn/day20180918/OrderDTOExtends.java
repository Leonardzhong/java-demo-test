package demo.core.dailylearn.day20180918;

import lombok.*;

/**
 * Demo
 *
 * @author zhongya
 * @date 2018/09/19
 */
@Data
@ToString(callSuper = true)
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class OrderDTOExtends extends OrderDTO{

    private String productionNo;
    @Builder
    private OrderDTOExtends(String orderNo, Integer quantity, String orderType, String productionNo) {
        super(orderNo, quantity, orderType);
        this.productionNo = productionNo;
    }
}
