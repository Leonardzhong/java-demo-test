package demo.core.leetcode;

import com.google.gson.Gson;

import java.util.ArrayList;
import java.util.List;

/**
 * 全排列
 *leetCode 46
 *
 * @author leonard
 * @create 2023-02-15 20:51
 */
public class Permute {

    public static void main(String[] args) {
        int[] nums = {1, 2, 3};

        List<List<Integer>> res = permute(nums);

        System.out.println("array after permute=" + new Gson().toJson(res));

        System.out.println("array after permute, size=" + res.size());

    }

    private static List<List<Integer>> permute(int[] nums) {

        List<List<Integer>> res = new ArrayList<>();

        dfs(res, new ArrayList<>(), nums);

        return res;
    }

    private static void dfs(List<List<Integer>> res, List<Integer> tmpList, int[] nums) {

        if (tmpList.size() == nums.length) {
            res.add(new ArrayList<>(tmpList));
            System.out.println("res=" + new Gson().toJson(res));
            return;
        }

        for (int i = 0; i < nums.length; i++) {

            //skip duplicate elements
            if (tmpList.contains(nums[i])) {
                continue;
            }

            tmpList.add(nums[i]);

            System.out.println("add i=" + i + ",nums[i]=" + nums[i] + ",tempList=" + new Gson().toJson(tmpList));

            dfs(res, tmpList, nums);

            tmpList.remove(tmpList.size() - 1);

            System.out.println("remove i=" + i + ",nums[i]=" + nums[i] + ",tempList=" + new Gson().toJson(tmpList));

        }

    }
}
