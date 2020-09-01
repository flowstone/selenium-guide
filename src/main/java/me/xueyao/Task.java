package me.xueyao;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

/**
 * @author Simon.Xue
 * @date 2020-02-05 20:47
 **/
@Configuration
@EnableScheduling
public class Task {
    private int count = 0;
    @Scheduled(cron = "0/5 * * * * ?")
    public void homework() throws InterruptedException {
        AutoTest.autoMarkHomework();
        System.out.println("健康素养学习测评系统做 " + count ++ + "遍");
    }
}
