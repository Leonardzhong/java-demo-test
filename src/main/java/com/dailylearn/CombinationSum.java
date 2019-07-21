package com.dailylearn;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class CombinationSum {

    public static void main(String[] args) {
        int[] candidates = new int[]{2, 3};
        int target  = 5;
        List<List<Integer>>  res = new ArrayList<>();
        res = combinationSum(candidates, target);
        System.out.println(res);
    }

    public static List<List<Integer>> combinationSum(int[] candidates, int target) {
        List<List<Integer>>  list=new ArrayList<List<Integer>>();
        Arrays.sort(candidates);
        backtrack(list, new ArrayList<Integer>(), candidates,target, 0);
        return list;

    }

    private static void backtrack(List<List<Integer>> list, List<Integer> tempList, int[] cand, int remain,int start){
        if(remain<0) return ;

        else if( remain==0) list.add(new ArrayList<>(tempList));

        else{
            for( int i=start;i< cand.length; i++){
                tempList.add(cand[i]);

                backtrack(list, tempList, cand, remain-cand[i], i);
                tempList.remove(tempList.size()-1);
            }

        }

    }
}
