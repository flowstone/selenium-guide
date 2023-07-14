package me.xueyao;

/**
 * 性别
 * @author Simon.Xue
 * @date 2023/7/15 02:38
 **/
public enum GenderEnum {
    MAN("男","1"),
    WOMAN("女", "2");

    GenderEnum(String name, String value) {
        this.name = name;
        this.value = value;
    }

    private String name;
    private String value;

    public String getName() {
        return name;
    }

    public String getValue() {
        return value;
    }
}
