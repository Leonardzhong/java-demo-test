package demo.core.leetcode;

import com.google.gson.Gson;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class CombinationSum {

    public static void main(String[] args) {
        int[] candidates = new int[]{2, 3, 6, 7};
        int target = 7;
        List<List<Integer>> res;
        res = combinationSum(candidates, target);
        System.out.println("res=" + res);
    }

    public static List<List<Integer>> combinationSum(int[] candidates, int target) {
        List<List<Integer>> list = new ArrayList<List<Integer>>();

        //非必需
        Arrays.sort(candidates);

        backtrack(list, new ArrayList<>(), candidates, target, 0);
        return list;

    }

    private static void backtrack(List<List<Integer>> list, List<Integer> tempList, int[] cand, int remain, int start) {
        if (remain < 0) {
            return;

        } else if (remain == 0) {
            list.add(new ArrayList<>(tempList));
            System.out.println("====remain==0====" + ",tempList=" + new Gson().toJson(tempList));

        } else {
            for (int i = start; i < cand.length; i++) {
                tempList.add(cand[i]);
                System.out.println("i=" + i + ",add[i]=" + cand[i] + ",tempList=" + new Gson().toJson(tempList) + ",remain=" + (remain-cand[i]));

                backtrack(list, tempList, cand, remain - cand[i], i);

                tempList.remove(tempList.size() - 1);
                System.out.println("i=" + i + ",remove[i]=" + cand[i] + ",tempList=" + new Gson().toJson(tempList) + ",remain="+ (remain-cand[i]));
            }

        }

    }
}
