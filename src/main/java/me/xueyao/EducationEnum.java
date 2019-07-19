package me.xueyao;

import java.util.Random;

/**
 * @author Simon.Xue
 * @date 2019-07-19 18:33
 **/
public enum EducationEnum {
    PRIMARYSCHOOL("小学", "1"),
    JUNIORHIGHSCHOOL("初中", "2"),
    MIDDLESCHOOL("高中/职高/中专", "3"),
    UNIVERSITY("大专/本科", "4"),
    MASTER("硕士及以上", "5"),;

    String message;
    String code;


    EducationEnum(String message, String code) {
        this.message = message;
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public String getCode() {
        return code;
    }

    public static String getRandomEducation() {
        int random = new Random().nextInt(5);
        return EducationEnum.values()[random].getCode();
    }

}
