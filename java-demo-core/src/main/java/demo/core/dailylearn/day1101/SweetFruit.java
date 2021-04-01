package demo.core.dailylearn.day1101;

/**
 * Created by zhongya on 2017/11/2.
 */
public abstract class SweetFruit implements Fruit {

    int weight = 2;

    double grownPeriod = 1.5;

    char productPlace = 'a';

    protected abstract void order(String name);

    public void buy(String fruitName) {
        System.out.println("the name of fruit bought is: " + fruitName +"\n"+ this.weight + "\n" + this.grownPeriod);
    }
}
