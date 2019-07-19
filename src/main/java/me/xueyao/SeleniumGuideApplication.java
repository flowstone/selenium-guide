package me.xueyao;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SeleniumGuideApplication {

    public static void main(String[] args) {
        SpringApplication.run(SeleniumGuideApplication.class, args);
        for (int i = 0; i < 100; i++) {
            try {
                AutoTest.autoMarkHomework();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

}
