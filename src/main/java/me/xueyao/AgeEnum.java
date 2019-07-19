package me.xueyao;

import java.util.Random;

/**
 * @author Simon.Xue
 * @date 2019-07-19 18:23
 **/
public enum AgeEnum {
    ONE("20～25岁以下", "03"),
    TWO("25～30岁以下", "04"),
    THREE("30～35岁以下", "05"),
    FOUR("35～40岁以下", "06"),
    FIVE("40～45岁以下", "07"),
    SIX("45～50岁以下", "08");

    String message;
    String code;

    AgeEnum(String message, String code) {
        this.message = message;
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public String getCode() {
        return code;
    }

    public static String getRandomAge() {
        int random = new Random().nextInt(6);
        return AgeEnum.values()[random].getMessage();
    }
}
