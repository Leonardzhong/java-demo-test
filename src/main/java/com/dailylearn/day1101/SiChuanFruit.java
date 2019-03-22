package com.dailylearn.day1101;

import org.springframework.stereotype.Component;



/**
 * Created by zhongya on 2017/11/2.
 */
@Component
public class SiChuanFruit extends SweetFruit{

    double grownPeriod = 4.1;

    public void order(String name) {
        System.out.println("the order of SiChuanFruit is: " + name);
    }

    public   void  print(){
        System.out.println("the fruit of sichuan province is:" + this.weight + "\n"+ this.productPlace + "\n"+ this.grownPeriod);
    }

    public void printIm(){
        System.out.println("print the interface varibles: " + Fruit.color + "\n" + Fruit.price + "\n" + Fruit.class +
        "\n" + this.getClass().getSimpleName());
        super.buy("watermelon");
    }

    @Override
    public void buy(String fruitName) {
        System.out.println("the name of SiChuanFruit is: " + fruitName);
    }

    public static void main(String[] args) {
        //测试类的继承和接口实现
        SiChuanFruit siChuanFruit = new SiChuanFruit();
        String name = "apple";
        siChuanFruit.buy(name);
        siChuanFruit.print();
        siChuanFruit.order(name);
        siChuanFruit.printIm();
        siChuanFruit.buy(name);
    }
}
