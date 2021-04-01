package demo.core.dailylearn.day20190627;

import java.util.ArrayList;
import java.util.List;

public class FirstCreateMethod extends Thread{

    private List<String> list;

    private FirstCreateMethod(List<String> list) {
        this.list = list;
    }

    @Override
    public void run() {
        for (String target : list) {
            System.out.println(Thread.currentThread().getName() + target);
        }
    }

    public static void main(String[] args) {
        List<String> list1 = new ArrayList<>();
        list1.add("六脉神剑");
        list1.add("独孤九剑");
        list1.add("辟邪剑法");
        FirstCreateMethod thread1 = new FirstCreateMethod(list1);
        List<String> list2 = new ArrayList<>();
        list2.add("玄铁剑法");
        list2.add("全真剑法");
        list2.add("玉女素心剑法");
        FirstCreateMethod thread2 = new FirstCreateMethod(list2);
        thread1.start();
        thread2.start();
    }

    public List<String> getList() {
        return list;
    }

    public void setList(List<String> list) {
        this.list = list;
    }
}