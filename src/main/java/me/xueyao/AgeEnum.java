package me.xueyao;

import java.util.Random;

/**
 * @author Simon.Xue
 * @date 2019-07-19 18:23
 **/
public enum AgeEnum {
    ONE("0～15岁以下", "01"),
    TWO("15～20岁以下", "02"),
    THREE("20～25岁以下", "03"),
    FOUR("25～30岁以下", "04"),
    FIVE("30～35岁以下", "05"),
    SIX("35～40岁以下", "06"),
    SEVEN("40～45岁以下", "07"),
    EIGHT("45～50岁以下", "08"),
    NINE("50～55岁以下", "09"),
    TEN("55～60岁以下", "10"),
    ELEVEN("60～65岁以下", "11"),
    TWELVE("65～70岁以下", "12"),
    THIRTEEN("70岁以上", "13");

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
