package me.xueyao;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SeleniumGuideApplication {

    public static void main(String[] args) {
        SpringApplication.run(SeleniumGuideApplication.class, args);
        for (int i = 1; i <= 100; i++) {
            try {
                AutoTest.autoMarkHomework();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("健康素养学习测评系统做 " + i + "遍");
        }
    }

}
