package dailylearn.day20180918;

import com.google.gson.Gson;

/**
 * Demo
 *
 * @author zhongya
 * @date 2018/09/18
 */
public class JsonTest {
    public static void main(String[] args) {
        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setOrderNo("123321");
        orderDTO.setOrderType("sale");
        orderDTO.setQuantity(10);
        OrderDTOExtends orderDTOExtends = OrderDTOExtends.builder()
                .productionNo("11111")
                .orderNo("123321")
                .orderType("sale")
                .quantity(10).build();

        String orderDtoJsonString = new Gson().toJson(orderDTO);
        System.out.println(orderDtoJsonString);
        System.out.println("--------orderDTOExtends");
        String orderDtoString1 = new Gson().toJson(orderDTOExtends);
        System.out.println(orderDtoString1);

        OrderDTO orderDTO1 = new Gson().fromJson(orderDtoString1, OrderDTO.class);
        System.out.println("--------------");
        System.out.println(orderDTO1.toString());
    }

}
