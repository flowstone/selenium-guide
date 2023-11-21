const { rejects } = require('assert');
const { resolve } = require('path');
const querystring = require('querystring');
const request = require('request');
/**
 * 性别 男1   女2
 * ------------------
 * 年龄 stcCallback1002
 * 03,04,05,06,07,08,09
 * --------------------
 * 文化程度 stcCallback1003
 * 1,2,3,4
 * --------------------
 * 职业分类 stcCallback1004
 * 医务人员 06
 * 饮食服务 04
 * --------------------
 * 工资 economicIncomeStatus
 * 1,2,3,4,5,6 学生选择1，否则选择6
 * --------------------
 * 婚姻状况 marriageStatus
 * 1,2 目前默认 2
 */
var zone3 = "淮安市";
var zone3Code = "3208000000";
var zone4 = "涟水县";
var zone4Code = "3208260000";
var zone5 = "南禄办";
var zone5Code = "3208261800";
var metier = "饮食服务";
var metierStatus = "04";
console.log("市:", zone3, "区:", zone4, "街道:", zone5, "职业:", metier,"职业编号:", metierStatus);

// 工资
var economicIncomeStatus = 6;
//婚姻状态
var marriageStatus = 2;
var orgName = "饮食服务单位";
//如果职业不是学生，则为0
var studentLevel = 0;

// 性别
var sexArr = ["1","2"];
var sex = sexArr[Math.floor(Math.random()*sexArr.length)];
//年龄
var ageArr = ["03","04","05","06","07","08","09"];
var age = ageArr[Math.floor(Math.random() * ageArr.length)];
//文化程度
var educationStatusArr = ["1","2","3","4"];
var educationStatus = educationStatusArr[Math.floor(Math.random() * educationStatusArr.length)];
var realname = getRandomName();
console.log("姓名:", realname, "性别:", sex, "年龄:", age, "文化程度:", educationStatus, "工资:", economicIncomeStatus, "婚姻状态:", marriageStatus, "单位:", orgName);

/**
 * https://www.jscdc.cn/KABP2011/pages/kabpstudy_new.html?zone3=3208000000&zone4=3208260000&zone5=3208261500"
 * +"&orgName=&sex=1&nametext=1&marriageStatus=2&ageGroup=04&educationStatus=3&metier=02&studentLevel=0"
 * +"&economicIncomeStatus=6&zone3text=%E6%B7%AE%E5%AE%89%E5%B8%82&zone4text=%E6%B6%9F%E6%B0%B4%E5%8E%BF"
 * +"&zone5text=%E6%9C%BA%E5%9C%BA%E4%BA%A7%E4%B8%9A%E5%9B%AD%E5%8C%BA&sextext=%E7%94%B7&marriageStatustext=%E6%9C%AA%E5%A9%9A"
 * +"&ageGrouptext=25%EF%BD%9E30%E5%B2%81%E4%BB%A5%E4%B8%8B&educationStatustext=%E9%AB%98%E4%B8%AD/%E8%81%8C%E9%AB%98/%E4%B8%AD%E4%B8%93"
 * +"&metiertext=%E6%95%99%E5%B8%88&studentLeveltext=------&economicIncomeStatustext=%E6%94%B6%E5%85%A5&lx=3"
 * +"&lxtext=%E9%A6%96%E9%A1%B5-%3E%E5%81%A5%E5%BA%B7%E7%B4%A0%E5%85%BB%E5%AD%A6%E4%B9%A0%E6%B5%8B%E8%AF%84
 */

/**
 * 获取题目
 * https://www.jscdc.cn/KABP2011/KABPStudy/buildSubjectJSONString.action?examType=3&lxType=%25&studentLevel=02,0&_dc=1700122205727&callback=stcCallback1001
 */
//-----------------------------------------------

//3 学习测评
var examType = 3;
//固定值
var lxType = '%'; 
// 获得题库的请求参数
const getExamRequestParamsJson = {
    "examType": examType,
    "lxType": lxType,
    "studentLevel": metierStatus+","+studentLevel,
    "_dc": new Date().getTime(),
    "callback": "stcCallback1001"
}
var getExamRequestParams = querystring.stringify(getExamRequestParamsJson);
// 获得题库列表
var getExamListUrl = "https://www.jscdc.cn/KABP2011/KABPStudy/buildSubjectJSONString.action?" + getExamRequestParams;
console.log("获得题库列表,拼接后最终URL:",getExamListUrl);


// ---------------初始化【开始】------------------
// 真实题目序号
var taPaperListPaperIdArr = new Array();
// 正确答案
var taPaperListPaperAnswerArr = new Array();
// 行为题1 和 知识题 2
var taPaperListPaperStyle1Arr = new Array();
// subjectType 判断题(1) 单选题(2) 多选题(3)
var taPaperListPaperStyle2Arr = new Array();
// 题目序号
var taPaperListAnswerIdArr = new Array();
// 回答的答案
var taPaperListAnswerContentArr = new Array();
// 知识题数
var taPaperListKnowledgeNumber = 0;
// 行为题数
var taPaperListActionNumber = 0;
// 正确行为题数
var taPaperListActionRightNumber = 0;
// 正确知识题数
var taPaperListKnowledgeRightNumber = 0;
// 最后正确题数
var taPaperListRightNumber = 0;
// 所有题数
var taPaperListSubjectNumber = 0;
// ---------------初始化【结束】------------------


/**
 * 提交答案
 * https://www.jscdc.cn/KABP2011/KABPStudy/paperExamCreate.action?taPaperList.metier=02
 * &taPaperList.studentLevel=0&taPaperList.sex=1&taPaperList.ageGroup=04&taPaperList.marriageStatus=2
 * &taPaperList.educationStatus=3&taPaperList.economicIncomeStatus=6
 * &taPaperList.paperId=650%2C1070%2C1054%2C836%2C1151%2C569%2C1178%2C961%2C1113%2C2020%2C2003%2C1648%2C1791%2C1348%2C1579%2C159%2C194%2C165%2C465%2C410%2C390%2C391%2C268%2C343%2C353%2C447%2C327%2C435%2C361
 * &taPaperList.paperAnswer=A%2CA%2CB%2CA%2CA%2CA%2CB%2CB%2CB%2CC%2CA%2CA%2CA%2CD%2CC%2CABCDE%2CABDE%2CABCDE%2CA%2CA%2CA%2CB%2CB%2CA%2CA%2CB%2CB%2CA%2CB
 * &taPaperList.paperStyle1=2%2C2%2C2%2C2%2C2%2C2%2C2%2C2%2C2%2C2%2C2%2C2%2C2%2C2%2C2%2C2%2C2%2C2%2C2%2C1%2C1%2C1%2C1%2C1%2C1%2C1%2C1%2C1%2C1
 * &taPaperList.paperStyle2=1%2C1%2C1%2C1%2C1%2C1%2C1%2C1%2C1%2C2%2C2%2C2%2C2%2C2%2C2%2C3%2C3%2C3%2C1%2C1%2C1%2C1%2C1%2C1%2C1%2C1%2C1%2C1%2C1
 * &taPaperList.answerId=1%2C2%2C3%2C4%2C5%2C6%2C7%2C8%2C9%2C10%2C11%2C12%2C13%2C14%2C15%2C16%2C17%2C18%2C19%2C20%2C21%2C22%2C23%2C24%2C25%2C26%2C27%2C28%2C29
 * &taPaperList.answerContent=A%2CA%2CA%2CA%2CA%2CA%2CA%2CA%2CA%2CC%2CC%2CC%2CC%2CC%2CC%2CD%2CD%2CC%2CA%2CA%2CA%2CA%2CA%2CA%2CA%2CA%2CA%2CA%2CA
 * &taPaperList.knowledgeNumber=19&taPaperList.actionNumber=10&taPaperList.actionRightNumber=5
 * &taPaperList.knowledgeRightNumber=8&taPaperList.rightNumber=13&taPaperList.subjectNumber=29
 * &taPaperList.examType=3&taPaperList.zone=3208261500&taPaperList.orgName=&taPaperList.logonname=1
 * &taPaperList.pwd=&taPaperList.cardNumber=&taPaperList.linkphone=
 * &taPaperList.zoneName=%E6%9C%BA%E5%9C%BA%E4%BA%A7%E4%B8%9A%E5%9B%AD%E5%8C%BA
 */

/**
 * taPaperList.metier: 02
 * taPaperList.studentLevel: 0
 * taPaperList.sex: 1
 * taPaperList.ageGroup: 04
 * taPaperList.marriageStatus: 2
 * taPaperList.educationStatus: 3
 * taPaperList.economicIncomeStatus: 6
 * taPaperList.paperId: 650,1070,1054,836,1151,569,1178,961,1113,2020,2003,1648,1791,1348,1579,159,194,165,465,410,390,391,268,343,353,447,327,435,361
 * taPaperList.paperAnswer: A,A,B,A,A,A,B,B,B,C,A,A,A,D,C,ABCDE,ABDE,ABCDE,A,A,A,B,B,A,A,B,B,A,B
 * taPaperList.paperStyle1: 2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1
 * taPaperList.paperStyle2: 1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,3,3,3,1,1,1,1,1,1,1,1,1,1,1
 * taPaperList.answerId: 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29
 * taPaperList.answerContent: A,A,A,A,A,A,A,A,A,C,C,C,C,C,C,D,D,C,A,A,A,A,A,A,A,A,A,A,A
 * taPaperList.knowledgeNumber: 19
 * taPaperList.actionNumber: 10
 * taPaperList.actionRightNumber: 5
 * taPaperList.knowledgeRightNumber: 8
 * taPaperList.rightNumber: 13
 * taPaperList.subjectNumber: 29
 * taPaperList.examType: 3
 * taPaperList.zone: 3208261500
 * taPaperList.orgName: 
 * taPaperList.logonname: 1
 * taPaperList.pwd: 
 * taPaperList.cardNumber: 
 * taPaperList.linkphone: 
 * taPaperList.zoneName: 机场产业园区
 */
// ---------------初始化【开始】------------------
var taPaperListMetier = "";
// 职业不是学生时，为0
var taPaperListStudentLevel = "";
// 性别
var taPaperListSex = "";
// 年龄
var taPaperListAgeGroup = "";
// 婚姻状态
var taPaperListMarriageStatus = "";
// 文化程度
var taPaperListEducationStatus = "";
// 收入状态
var taPaperListEconomicIncomeStatus = "";
// 真实题目序号
var taPaperListPaperId = "";
// 正确答案
var taPaperListPaperAnswer = "";
// 行为题1 和 知识题 2
var taPaperListPaperStyle1 = "";

// subjectType 判断题(1) 单选题(2) 多选题(3)
var taPaperListPaperStyle2 = "";

// 题目序号
var taPaperListAnswerId = "";

// 回答的答案
var taPaperListAnswerContent = "";

/** 
// 知识题数
var taPaperListKnowledgeNumber = 19;
// 行为题数
var taPaperListActionNumber = 10;
// 正确行为题数
var taPaperListActionRightNumber = 5;
// 正确知识题数
var taPaperListKnowledgeRightNumber = 8;
// 最后正确题数
var taPaperListRightNumber = 13;
// 所有题数
var taPaperListSubjectNumber = 29;
*/
// 3 学习测评
var taPaperListExamType = "";
// 街道编号
var taPaperListZone = "";
// 单位
var taPaperListOrgName = "";
// 姓名
var taPaperListLogonname = "";
var taPaperListPwd = "";
var taPaperListCardNumber = "";
var taPaperListLinkphone = "";
// 街道
var taPaperListZoneName = "";
// ---------------初始化【结束】------------------


new Promise((resolve, rejects) => {
    request(getExamListUrl, (err, rep, body) => {
        if (err) {
            console.warn("请求错误 err:", err)
        }
        if (rep.statusCode == 200 && body) {
            console.log("---------- 拉取题库 ----------");
            //console.log("拉取题库，请求的URL地址：", rep.request.href)
            var resultJsonData = JSON.parse(body.substring(16, body.length - 1));
            console.log("生成的试题题数：", resultJsonData.total);
            taPaperListSubjectNumber = resultJsonData.total;
            //console.log("处理后的JSON格式数据：", resultJsonData.results);
            var resultArr = resultJsonData.results;
            for (var index in resultArr) {
                setExamIteamParams(index, resultArr);
            }

            setExamSubmitParams();
            resolve("success");
        }
    })
 
}).then(()=>{
    /**
     * Math.floor(Math.random() * (max - min + 1)) + min
     * 生成7000~30000之间的随机数
     */
    const timeRandom = Math.floor(Math.random() * (30000 - 7000 + 1)) + 7000;
    console.log(`---- 休眠${timeRandom}毫秒钟后，进入提交答案业务 ----`);

    return wait(timeRandom);
}).then(()=> {
    const submitExamRequestParamsJson = {
        "taPaperList.metier": taPaperListMarriageStatus,
        "taPaperList.studentLevel": studentLevel,
        "taPaperList.sex": sex,
        "taPaperList.ageGroup": age,
        "taPaperList.marriageStatus": marriageStatus,
        "taPaperList.educationStatus": educationStatus,
        "taPaperList.economicIncomeStatus": economicIncomeStatus,
        "taPaperList.paperId": taPaperListPaperId,
        "taPaperList.paperAnswer": taPaperListPaperAnswer,
        "taPaperList.paperStyle1": taPaperListPaperStyle1,
        "taPaperList.paperStyle2": taPaperListPaperStyle2,
        "taPaperList.answerId": taPaperListAnswerId,
        "taPaperList.answerContent": taPaperListAnswerContent,
        "taPaperList.knowledgeNumber": taPaperListKnowledgeNumber,
        "taPaperList.actionNumber": taPaperListActionNumber,
        "taPaperList.actionRightNumber": taPaperListActionRightNumber,
        "taPaperList.knowledgeRightNumber": taPaperListKnowledgeRightNumber,
        "taPaperList.rightNumber": taPaperListRightNumber,
        "taPaperList.subjectNumber": taPaperListSubjectNumber,
        "taPaperList.examType": taPaperListExamType,
        "taPaperList.zone": taPaperListZone,
        "taPaperList.orgName":taPaperListOrgName,
        "taPaperList.logonname": taPaperListLogonname,
        "taPaperList.pwd":taPaperListPwd,
        "taPaperList.cardNumber":taPaperListCardNumber,
        "taPaperList.linkphone":taPaperListLinkphone,
        "taPaperList.zoneName": taPaperListZoneName
    };
    console.log("提交答案的请求参数:", submitExamRequestParamsJson);
    var submitExamRequestParams = querystring.stringify(submitExamRequestParamsJson);
    var submitExamUrl = "https://www.jscdc.cn/KABP2011/KABPStudy/paperExamCreate.action?" + submitExamRequestParams;

    console.log("提交答题，拼接后最终URL:", submitExamUrl);
    request(submitExamUrl, (err, rep, body) => {
        console.log("---------- 正在提交答案 ----------");
        if (err) {
            console.warn("提交错误 err:", err)
        }
        if (rep.statusCode == 200 && body) {
            console.log("---------- 处理中 ----------");
            //console.log("拉取题库，请求的URL地址：", rep.request.href)
            // 处理返回结果，坏结构
            var tempStr = body.replace("[[", "");
            tempStr = tempStr.substring(0, tempStr.length - 1);
            var tempArr = tempStr.split("],");
            //console.log("处理后的结果:",tempArr);

            console.log("返回内容结果:",JSON.parse(tempArr[0]));
            var resultStatus = JSON.stringify(tempArr[1]);
            console.log("返回状态结果:", resultStatus);
            
            // 原网站用前端计算得分
            var totalRat = ((parseFloat((parseFloat(taPaperListKnowledgeRightNumber) + parseFloat(taPaperListActionRightNumber)) / (parseInt(taPaperListKnowledgeNumber) + parseInt(taPaperListActionNumber)))).toFixed(2)) * 100;
            console.log("您的得分(估算)：", totalRat);
        }
    })
})

/**
 * 休眠方法
 * @param {时间毫秒} ms 
 * @returns 
 */
function wait(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
};
/**
 * 第一步
 * 获取每个题目中部分数据
 */
function setExamIteamParams(index, resultArr) {
    var no = parseInt(index) + 1;
    var temp = resultArr[index];

    //console.log("问题" + no + ":", temp.subjectContent);
    taPaperListAnswerIdArr[index] = no;

    // subjectType 判断题(1) 单选题(2) 多选题(3)
    //console.log("选项类型 判断题(1)、单选题(2)、多选题(3):", temp.subjectType);
    taPaperListPaperStyle2Arr[index] = temp.subjectType;


    // 行为题1 和 知识题 2
    //console.log("题目类型 行为题(1)、知识题(2):", temp.actionOrKnowledge);
    taPaperListPaperStyle1Arr[index] = temp.actionOrKnowledge;
    if (parseInt(temp.actionOrKnowledge) == 2) {
        taPaperListKnowledgeNumber++;
    } else {
        taPaperListActionNumber++;
    }

    //console.log("选项:", temp.answer1, temp.answer2, temp.answer3, temp.answer4);

    // 正确答案
    //console.log("正确答案:", temp.answer);
    taPaperListPaperAnswerArr[index] = temp.answer;

    // 真实题目序号
    //console.log("真实题目序号:", temp.subjectId);
    taPaperListPaperIdArr[index] = temp.subjectId;

    /**
     * V1. 答案的选择方案
     * ----------- 过期方法 -------------
     * 如果不是多选题，选择A，否则使用正确答案
    if (parseInt(temp.subjectType) != 3) {
        taPaperListAnswerContentArr[index] = temp.answer;
        taPaperListRightNumber++;
        if (parseInt(temp.actionOrKnowledge) == 2) {
            taPaperListKnowledgeRightNumber++;
        } else {
            taPaperListActionRightNumber++;
        }
    } else {
        taPaperListAnswerContentArr[index] = "A";
    }
    */

    /**
     * V2. 答案的选择方案
     * True 选择正确答案
     * False 随机选择答案
     
    if (Boolean(Math.round(Math.random()))) {
        console.log("正在选择正确的答案:", temp.answer);
        taPaperListAnswerContentArr[index] = temp.answer;
        taPaperListRightNumber++;

        if (parseInt(temp.actionOrKnowledge) == 2) {
            taPaperListKnowledgeRightNumber++;
        } else {
            taPaperListActionRightNumber++;
        }
    } else {
        var itemArr = ["A", "B", "C", "D"];
        var item = itemArr[Math.floor(Math.random() * itemArr.length)]
        console.log("正在选择随机的答案:", item);

        taPaperListAnswerContentArr[index] = item;
    }
    */
    //选择答案的方案
    changeQuestionAnswer(index, temp);
}

/**
 * 选择答案的方案
 * @param {问题的下标} index 
 * @param {问题对象} questionObject 
 */
function changeQuestionAnswer(index, questionObject) {
    var answerArr = ["A", "B", "C", "D"];
    var answerRandom = answerArr[Math.floor(Math.random() * answerArr.length)];
    var answerTrue = questionObject.answer;

    if (Boolean(Math.round(Math.random()))) {
        /**
         * V2. 答案的选择方案
         * ----- 选择随机的答案 -----------
         * True 选择正确答案
         * False 随机选择答案
         */
        //console.log("进入答案选择方案[2]");
        taPaperListAnswerContentArr[index] = Boolean(Math.round(Math.random())) ? answerTrue : answerRandom;
        
    } else {
        /**
         * V1. 答案的选择方案
         * ----- 高得分的答案 -----------
         * 如果不是多选题，随机，否则使用正确答案
         */
        //console.log("进入答案选择方案[1]");
        taPaperListAnswerContentArr[index] = parseInt(questionObject.subjectType) != 3 ? answerTrue : answerRandom;
        
    }
    // 累加正确的答案数
    if (taPaperListAnswerContentArr[index] == answerTrue) {
        taPaperListRightNumber++;
        if (parseInt(questionObject.actionOrKnowledge) == 2) {
            taPaperListKnowledgeRightNumber++;
        } else {
            taPaperListActionRightNumber++;
        }
    }
    
}

/**
 * 第二步
 * 设置提交答题的数据
 */
function setExamSubmitParams() {
    console.log("---------- [开始]设置提交答题的数据 ----------");
    taPaperListMetier = metierStatus;
    // 职业不是学生时，为0
    taPaperListStudentLevel = studentLevel;
    //性别
    taPaperListSex = sex;
    // 年龄
    taPaperListAgeGroup = age;
    // 婚姻状态
    taPaperListMarriageStatus = marriageStatus;
    // 文化程度
    taPaperListEducationStatus = educationStatus;
    // 收入状态
    taPaperListEconomicIncomeStatus = economicIncomeStatus;
    // 真实题目序号
    taPaperListPaperId = taPaperListPaperIdArr.toString();
    console.log("真实题目序号:", taPaperListPaperId);
    // 正确答案
    taPaperListPaperAnswer = taPaperListPaperAnswerArr.toString();
    console.log("正确答案:", taPaperListPaperAnswer);
    // 行为题1 和 知识题 2
    taPaperListPaperStyle1 = taPaperListPaperStyle1Arr.toString();
    console.log("题目内容类型:", taPaperListPaperStyle1);

    // subjectType 判断题(1) 单选题(2) 多选题(3)
    taPaperListPaperStyle2 = taPaperListPaperStyle2Arr.toString();
    console.log("题目选项类型:", taPaperListPaperStyle2);

    // 题目序号
    taPaperListAnswerId = taPaperListAnswerIdArr.toString();
    console.log("题目序号:", taPaperListAnswerId);

    // 回答的答案
    taPaperListAnswerContent = taPaperListAnswerContentArr.toString();
    console.log("回答的答案:", taPaperListAnswerContent);

    // 3 学习测评
    taPaperListExamType = examType;
    // 街道编号
    taPaperListZone = zone5Code;
    // 单位
    taPaperListOrgName = orgName;
    // 姓名
    taPaperListLogonname = realname;
    taPaperListPwd = "";
    taPaperListCardNumber = "";
    taPaperListLinkphone = "";
    // 街道
    taPaperListZoneName = zone5;
    console.log("---------- [结束]设置提交答题的数据 ----------");

}


/**
 * 随机生成人名
 * @returns 生成的人名
 */
function getRandomName() {
    var firstNames = new Array(
        '赵', '钱', '孙', '李', '周', '吴', '郑', '王', '冯', '陈', '楮', '卫', '蒋', '沈', '韩', '杨',
        '朱', '秦', '尤', '许', '何', '吕', '施', '张', '孔', '曹', '严', '华', '金', '魏', '陶', '姜',
        '戚', '谢', '邹', '喻', '柏', '水', '窦', '章', '云', '苏', '潘', '葛', '奚', '范', '彭', '郎',
        '鲁', '韦', '昌', '马', '苗', '凤', '花', '方', '俞', '任', '袁', '柳', '酆', '鲍', '史', '唐',
        '费', '廉', '岑', '薛', '雷', '贺', '倪', '汤', '滕', '殷', '罗', '毕', '郝', '邬', '安', '常',
        '乐', '于', '时', '傅', '皮', '卞', '齐', '康', '伍', '余', '元', '卜', '顾', '孟', '平', '黄',
        '和', '穆', '萧', '尹', '姚', '邵', '湛', '汪', '祁', '毛', '禹', '狄', '米', '贝', '明', '臧',
        '计', '伏', '成', '戴', '谈', '宋', '茅', '庞', '熊', '纪', '舒', '屈', '项', '祝', '董', '梁',
        '杜', '阮', '蓝', '闽', '席', '季', '麻', '强', '贾', '路', '娄', '危', '江', '童', '颜', '郭',
        '梅', '盛', '林', '刁', '锺', '徐', '丘', '骆', '高', '夏', '蔡', '田', '樊', '胡', '凌', '霍',
        '虞', '万', '支', '柯', '昝', '管', '卢', '莫', '经', '房', '裘', '缪', '干', '解', '应', '宗',
        '丁', '宣', '贲', '邓', '郁', '单', '杭', '洪', '包', '诸', '左', '石', '崔', '吉', '钮', '龚',
        '程', '嵇', '邢', '滑', '裴', '陆', '荣', '翁', '荀', '羊', '於', '惠', '甄', '麹', '家', '封',
        '芮', '羿', '储', '靳', '汲', '邴', '糜', '松', '井', '段', '富', '巫', '乌', '焦', '巴', '弓',
        '牧', '隗', '山', '谷', '车', '侯', '宓', '蓬', '全', '郗', '班', '仰', '秋', '仲', '伊', '宫',
        '宁', '仇', '栾', '暴', '甘', '斜', '厉', '戎', '祖', '武', '符', '刘', '景', '詹', '束', '龙',
        '叶', '幸', '司', '韶', '郜', '黎', '蓟', '薄', '印', '宿', '白', '怀', '蒲', '邰', '从', '鄂',
        '索', '咸', '籍', '赖', '卓', '蔺', '屠', '蒙', '池', '乔', '阴', '郁', '胥', '能', '苍', '双',
        '闻', '莘', '党', '翟', '谭', '贡', '劳', '逄', '姬', '申', '扶', '堵', '冉', '宰', '郦', '雍',
        '郤', '璩', '桑', '桂', '濮', '牛', '寿', '通', '边', '扈', '燕', '冀', '郏', '浦', '尚', '农',
        '温', '别', '庄', '晏', '柴', '瞿', '阎', '充', '慕', '连', '茹', '习', '宦', '艾', '鱼', '容',
        '向', '古', '易', '慎', '戈', '廖', '庾', '终', '暨', '居', '衡', '步', '都', '耿', '满', '弘',
        '匡', '国', '文', '寇', '广', '禄', '阙', '东', '欧', '殳', '沃', '利', '蔚', '越', '夔', '隆',
        '师', '巩', '厍', '聂', '晁', '勾', '敖', '融', '冷', '訾', '辛', '阚', '那', '简', '饶', '空',
        '曾', '毋', '沙', '乜', '养', '鞠', '须', '丰', '巢', '关', '蒯', '相', '查', '后', '荆', '红',
        '游', '竺', '权', '逑', '盖', '益', '桓', '公', '仉', '督', '晋', '楚', '阎', '法', '汝', '鄢',
        '涂', '钦', '岳', '帅', '缑', '亢', '况', '后', '有', '琴', '归', '海', '墨', '哈', '谯', '笪',
        '年', '爱', '阳', '佟', '商', '牟', '佘', '佴', '伯', '赏', "万俟", "司马", "上官", "欧阳", "夏侯",
        "诸葛", "闻人", "东方", "赫连", "皇甫", "尉迟", "公羊", "澹台", "公冶", "宗政", "濮阳", "淳于",
        "单于", "太叔", "申屠", "公孙", "仲孙", "轩辕", "令狐", "锺离", "宇文", "长孙", "慕容", "鲜于",
        "闾丘", "司徒", "司空", "丌官", "司寇", "子车", "微生", "颛孙", "端木", "巫马", "公西", "漆雕",
        "乐正", "壤驷", "公良", "拓拔", "夹谷", "宰父", "谷梁", "段干", "百里", "东郭", "南门", "呼延",
        "羊舌", "梁丘", "左丘", "东门", "西门", "南宫"
    );

    var lastNames = new Array(
        '子璇', '淼', '国栋', '夫子', '瑞堂', '甜', '敏', '尚', '国贤', '贺祥', '晨涛',
        '昊轩', '易轩', '益辰', '益帆', '益冉', '瑾春', '瑾昆', '春齐', '杨', '文昊',
        '东东', '雄霖', '浩晨', '熙涵', '溶溶', '冰枫', '欣欣', '宜豪', '欣慧', '建政',
        '美欣', '淑慧', '文轩', '文杰', '欣源', '忠林', '榕润', '欣汝', '慧嘉', '新建',
        '建林', '亦菲', '林', '冰洁', '佳欣', '涵涵', '禹辰', '淳美', '泽惠', '伟洋',
        '涵越', '润丽', '翔', '淑华', '晶莹', '凌晶', '苒溪', '雨涵', '嘉怡', '佳毅',
        '子辰', '佳琪', '紫轩', '瑞辰', '昕蕊', '萌', '明远', '欣宜', '泽远', '欣怡',
        '佳怡', '佳惠', '晨茜', '晨璐', '运昊', '汝鑫', '淑君', '晶滢', '润莎', '榕汕',
        '佳钰', '佳玉', '晓庆', '一鸣', '语晨', '添池', '添昊', '雨泽', '雅晗', '雅涵',
        '清妍', '诗悦', '嘉乐', '晨涵', '天赫', '玥傲', '佳昊', '天昊', '萌萌', '若萌',
        "秋白", "南风", "醉山", "初彤", "凝海", "紫文", "凌晴", "香卉", "雅琴", "傲安",
        "傲之", "初蝶", "寻桃", "代芹", "诗霜", "春柏", "绿夏", "碧灵", "诗柳", "夏柳",
        "采白", "慕梅", "乐安", "冬菱", "紫安", "宛凝", "雨雪", "易真", "安荷", "静竹",
        "飞雪", "雪兰", "雅霜", "从蓉", "冷雪", "靖巧", "翠丝", "觅翠", "凡白", "乐蓉",
        "迎波", "丹烟", "梦旋", "书双", "念桃", "夜天", "海桃", "青香", "恨风", "安筠",
        "觅柔", "初南", "秋蝶", "千易", "安露", "诗蕊", "山雁", "友菱", "香露", "晓兰",
        "涵瑶", "秋柔", "思菱", "醉柳", "以寒", "迎夏", "向雪", "香莲", "以丹", "依凝",
        "如柏", "雁菱", "凝竹", "宛白", "初柔", "南蕾", "书萱", "梦槐", "香芹", "南琴",
        "绿海", "沛儿", "晓瑶", "听春", "易巧", "念云", "晓灵", "静枫", "夏蓉", "如南",
        "幼丝", "秋白", "冰安", "凝蝶", "紫雪", "念双", "念真", "曼寒", "凡霜", "白卉",
        "语山", "冷珍", "秋翠", "夏柳", "如之", "忆南", "书易", "翠桃", "寄瑶", "如曼",
        "问柳", "香梅", "幻桃", "又菡", "春绿", "醉蝶", "亦绿", "诗珊", "听芹", "新之",
        "博瀚", "博超", "才哲", "才俊", "成和", "成弘", "昊苍", "昊昊", "昊空", "昊乾",
        "昊然", "昊然", "昊天", "昊焱", "昊英", "浩波", "浩博", "浩初", "浩大", "浩宕",
        "浩荡", "浩歌", "浩广", "浩涆", "浩瀚", "浩浩", "浩慨", "浩旷", "浩阔", "浩漫",
        "浩淼", "浩渺", "浩邈", "浩气", "浩然", "浩穰", "浩壤", "浩思", "浩言", "皓轩",
        "和蔼", "和安", "和昶", "翔东", "昊伟", "楚桥", "智霖", "浩杰", "炎承", "思哲",
        "璟新", "楚怀", "继智", "昭旺", "俊泽", "子中", "羽睿", "嘉雷", "鸿翔", "明轩",
        "棋齐", "轶乐", "昭易", "臻翔", "泽鑫", "芮军", "浩奕", "宏明", "忠贤", "锦辉",
        "元毅", "霈胜", "宇峻", "子博", "语霖", "胜佑", "俊涛", "浩淇", "乐航", "泽楷",
        "嘉宁", "敬宣", "韦宁", "建新", "宇怀", "皓玄", "冠捷", "俊铭", "一鸣", "堂耀",
        "轩凝", "舰曦", "跃鑫", "梓杰", "筱宇", "弘涛", "羿天", "广嘉", "陆铭", "志卿",
        "连彬", "景智", "孟昕", "羿然", "文渊", "羿楦", "晗昱", "晗日", "涵畅", "涵涤",
        "昊穹", "涵亮", "涵忍", "涵容", "俊可", "智鹏", "诚钰", "书墨", "俊易", "浩渺",
        "宸水", "嘉许", "时贤", "飞腾", "沂晨", "殿斌", "霄鸿", "辰略", "澜鸿", "景博",
        "咨涵", "修德", "景辉", "语旋", "智逸", "鸿锋", "思梵", "弈煊", "泰河", "逞宇",
        "嘉颢", "锦沅", "颢焱", "萧彬", "悦升", "香音", "烨柠", "颢咏", "仁贤", "尚然",
        "羿鳞", "月鸿", "健霖", "鸿昊", "竣杰", "可顺", "炯乐", "俊彦", "海沧", "捷明",
        "飞扬", "杰辰", "羽捷", "曦晴", "裕鸿", "翌锦", "沐宸", "福同", "旻驰", "龙宁",
        "文虹", "义凡", "广晨", "宸滔", "嘉岐", "雅珺", "睿明", "皓轩", "程天", "子酝",
        "艾康", "如羽", "冠玉", "子歉", "永昊", "龙华", "兆颜", "奇文", "月昕", "裕锦",
        "昂佳", "昊浩", "宇韬", "睿焓", "永译", "鸿彬", "颢霖", "益彬", "虹昊", "飞悦",
        "睿珏", "?宵童", "睿鸿", "容冰", "逸濠", "楷岩", "弘义", "海萦", "昊孺", "梓铭",
        "生钊", "蓝玺", "晨辕", "宇菡", "砚海", "文揩", "韬瑞", "彦红", "奕韦", "清予",
        "宁翼", "冬睿", "锦昌", "烨宁", "昌权", "国研", "德运", "孝清", "佳阳", "凯玮",
        "正真", "民云", "昕冶", "力威", "帅欣", "知淳", "烨飞", "兴远", "子墨", "澄欣",
        "烨煊", "悦勤", "晨津", "博宏", "育萌", "羽炫", "绍钧", "睿昌", "泓千", "颢炜",
        "虹金", "筠航", "元甲", "星明", "景涛", "铭虹", "德本", "向辉", "基翔", "家易",
        "欣鹏", "羽荃", "泽容", "弘亮", "尚廷", "轩梓", "甫津", "彬楷", "寅飞", "愉君",
        "阳平", "誉杰", "钦昭", "蕴藉", "羽程", "宏海", "涵畅", "光浩", "令沂", "浩浩",
        "睿锦", "易泽", "俊康", "家文", "晨元", "语洋", "裕宏", "梓榛", "阳嘉", "恒展",
        "雨远", "哲伊", "逸江", "丰源", "学东", "奇岩", "浩财", "和蔼", "红言", "瑞赫",
        "森圆", "欣赢", "梓鸿", "博明", "铭育", "颢硕", "宇烯", "宇如", "淳炎", "源承",
        "斌彬", "飞沉", "鸿璐", "昊弘"
    );

    var firstLength = firstNames.length;
    var lastLength = lastNames.length;
    var name = firstNames[Math.floor(Math.random() * firstLength)] + lastNames[Math.floor(Math.random() * lastLength)];
    return name;

}

