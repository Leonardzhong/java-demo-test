package demo.core.leetcode;

import com.google.gson.Gson;

import java.util.ArrayList;
import java.util.List;

/**
 * leetcode 78
 *
 * @author leonard
 * @create 2023-02-27 23:33
 */
public class Subsets {

    public static void main(String[] args) {

        int[] nums = {1, 2, 3};

        System.out.println("subsets, input=" + new Gson().toJson(nums));

        List<List<Integer>> res;

        res = subsets(nums);

        System.out.println("subsets, output=" + new Gson().toJson(res));

    }

    private static List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();

        backTrack(res, nums, new ArrayList<>(), 0);

        return res;
    }

    private static void backTrack(List<List<Integer>> res, int[] nums, ArrayList<Integer> tempArrayList, int i) {

        res.add(new ArrayList<>(tempArrayList));

        System.out.println("add tempArrayList, res=" + new Gson().toJson(res));

        for (int j = i; j < nums.length; j++) {

            tempArrayList.add(nums[j]);

            System.out.println("tempArrayList add,i=" + i + ",nums[i]=" + nums[i] + ",j=" + j + ",tempArrayList=" + new Gson().toJson(tempArrayList));

            backTrack(res, nums, tempArrayList, j + 1);

            tempArrayList.remove(tempArrayList.size() - 1);

            System.out.println("tempArrayList remove,i=" + i + ",nums[i]=" + nums[i] + ",j=" + j + ",tempArrayList=" + new Gson().toJson(tempArrayList));


        }

    }
}
