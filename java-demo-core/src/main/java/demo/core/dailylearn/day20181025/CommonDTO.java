package demo.core.dailylearn.day20181025;

/**
 * Demo
 *
 * @author zhongya
 * @date 2018/10/25
 */
public class CommonDTO {
    private String orderId;

    private Integer orderQuantity;

    private Long createTime;

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public Integer getOrderQuantity() {
        return orderQuantity;
    }

    public void setOrderQuantity(Integer orderQuantity) {
        this.orderQuantity = orderQuantity;
    }

    public Long getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Long createTime) {
        this.createTime = createTime;
    }

    public CommonDTO(String orderId, Integer orderQuantity, Long createTime) {
        this.orderId = orderId;
        this.orderQuantity = orderQuantity;
        this.createTime = createTime;
    }
}
