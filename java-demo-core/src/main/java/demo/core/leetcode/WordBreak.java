package demo.core.leetcode;

import com.google.common.collect.Lists;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * leetcode 139
 *
 * @author leonard
 * @create 2023-03-05 20:58
 */
public class WordBreak {

    public static void main(String[] args) {

        String s = "leetcode";

        List<String> wordDict = Lists.newArrayList("leet", "code");

        boolean res;

        res = wordBreak(s, wordDict);

        System.out.println("wordBreak, output=" + res);

    }

    private static boolean wordBreak(String s, List<String> wordDict) {

        Set<String> wordDictSet = new HashSet<>(wordDict);
        //dp[i] 表示字符串 s 前 i 个字符组成的字符串 s[0..i−1]是否能被空格拆分成若干个字典中出现的单词
        boolean[] dp = new boolean[s.length() + 1];
        dp[0] = true;
        for (int i = 1; i <= s.length(); i++) {
            for (int j = 0; j < i; j++) {
                if (dp[j] && wordDictSet.contains(s.substring(j, i))) {
                    dp[i] = true;
                    break;
                }
            }
        }
        return dp[s.length()];

    }
}
