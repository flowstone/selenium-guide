package me.xueyao;

/**
 * 工作枚举
 * @author Simon.Xue
 * @date 2023/7/15 02:48
 **/
public enum JobEnum {
    STUDENT("学生", "01"),
    TEACHER("教师", "02"),
    NANNY("保育保姆", "03"),
    FOOD_SERVICE("饮食服务", "04"),
    BUSINESS_SERVICES("商业服务", "05"),
    DOCKER("医务人员", "06"),
    WORKER("工人", "07"),
    MIGRANT_WORKER("民工", "08"),
    FARMER("农民", "09"),
    HERDSMAN("牧民", "10"),
    FISHERMAN("渔（船）民", "11"),
    GET_MONEY("干部职员", "12"),
    NO_WORK("家务待业", "13"),
    COMPANY_MANAGE("公司管理", "14"),;
    private String name;
    private String value;

    JobEnum(String name, String value) {
        this.name = name;
        this.value = value;
    }

    public String getName() {
        return name;
    }

    public String getValue() {
        return value;
    }
}
