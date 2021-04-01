package demo.core.dailylearn.day20180918;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * Demo
 *
 * @author zhongya
 * @date 2018/09/18
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderDTO implements Serializable {

    private String orderNo;

    private Integer quantity;

    private String orderType;

}
