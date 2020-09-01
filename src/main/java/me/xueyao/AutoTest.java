package me.xueyao;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

import java.util.List;
import java.util.Random;
import java.util.Set;

/**
 * @author Simon.Xue
 * @date 2019-07-18 20:36
 **/
public class AutoTest {
    /**
     * 自动做题
     * @throws InterruptedException
     */
    public static void autoMarkHomework() throws InterruptedException {
        WebDriver webDriver = init();

        webDriver.get("http://www.jscdc.cn/");
        webDriver.findElement(By.linkText("疾控服务")).click();
        webDriver.findElement(By.xpath("//*[@class='jkPhone']/ul/li[3]/a")).click();


        String currentHandle = webDriver.getWindowHandle();
        System.out.println("currentHandle:" + currentHandle);

        Set<String> windowHandles = webDriver.getWindowHandles();
        for (String s : windowHandles) {
            if (s.equals(currentHandle)) {
                continue;
            } else {
                webDriver.switchTo().window(s);
            }
        }


        System.out.println(webDriver.getTitle());

        fullPersonInfo(webDriver);

        //点击按钮
        webDriver.findElement(By.id("log_img")).click();

        System.out.println("currentHandle:" + webDriver.getWindowHandle());

        //--------做题
        WebElement subject = webDriver.findElement(By.id("subject"));
        List<WebElement> lis = subject.findElements(By.tagName("li"));
        for (WebElement ls : lis) {
            WebElement kWait = ls.findElement(By.className("KWait"));
            List<WebElement> inputl = kWait.findElements(By.tagName("input"));
            if (inputl.size() > 4) {
                int i = new Random().nextInt(4);
                inputl.get(i).click();
                webDriver.findElement(By.id("btnNext")).click();

                /*for (WebElement webElement : inputl) {
                    webElement.click();
                    webDriver.findElement(By.id("btnNext")).click();
                    break;
                }*/

            } else {
                int i = new Random().nextInt(2);
                inputl.get(i).click();

                /*for (WebElement webElement : inputl) {
                    webElement.click();
                    break;
                }*/
            }

        }

        //交卷按钮
        int count = lis.size();
        WebElement element = webDriver.findElement(By.id("btnAct" + count));
        element.findElement(By.tagName("input")).click();
        Thread.sleep(500);
        //再次确认
        webDriver.switchTo().alert().accept();
        Thread.sleep(500);
        //关闭窗口
        webDriver.quit();
    }

    /**
     * 填充个人信息
     * @param webDriver
     */
    private static void fullPersonInfo(WebDriver webDriver) {

        String[] ageList = {};
        //市  地区

        WebElement city = webDriver.findElement(By.id("zone3"));
        List<WebElement> cityOptions = city.findElements(By.tagName("option"));
        for (WebElement cityOption : cityOptions) {
            if ("淮安市".equals(cityOption.getText())) {
                cityOption.click();
            }
        }

        //县  地区
        WebElement county = webDriver.findElement(By.id("zone4"));
        List<WebElement> countyOptions = county.findElements(By.tagName("option"));
        for (WebElement countyOption : countyOptions) {
            if ("涟水县".equals(countyOption.getText())) {
                countyOption.click();
            }
        }
        //乡  地区
        WebElement countryside = webDriver.findElement(By.id("zone5"));
        List<WebElement> countrysideOptions = countryside.findElements(By.tagName("option"));
        for (WebElement countrysideOption : countrysideOptions) {
            if ("南禄办".equals(countrysideOption.getText())) {
                countrysideOption.click();
            }
        }

        WebElement name = webDriver.findElement(By.id("name"));
        name.sendKeys(new ChineseName().toString());

        //年龄
        WebElement ageGroup = webDriver.findElement(By.id("ageGroup"));
        List<WebElement> ageGroupOptions = ageGroup.findElements(By.tagName("option"));
        for (WebElement ageGroupOption : ageGroupOptions) {
            if ("35～40岁以下".equals(ageGroupOption.getText())) {
                ageGroupOption.click();
            }
        }

        //性别
        WebElement sex = webDriver.findElement(By.id("sex"));
        List<WebElement> sexOptions = sex.findElements(By.tagName("option"));
        for (WebElement sexOption : sexOptions) {

            if ("1".equals(sexOption.getAttribute("value"))) {
                sexOption.click();
            }
        }


        //教育
        WebElement educationStatus = webDriver.findElement(By.id("educationStatus"));
        List<WebElement> educationStatusOptions = educationStatus.findElements(By.tagName("option"));
        for (WebElement educationStatusOption : educationStatusOptions) {

            if ("大专/本科".equals(educationStatusOption.getText())) {
                educationStatusOption.click();
            }
        }

        //职业
        WebElement metier = webDriver.findElement(By.id("metier"));
        List<WebElement> metierOptions = metier.findElements(By.tagName("option"));
        for (WebElement metierOption : metierOptions) {
            if ("饮食服务".equals(metierOption.getText())) {
                metierOption.click();
            }
        }
        //单位
        WebElement orgName = webDriver.findElement(By.id("orgName"));
        orgName.sendKeys("饮食服务");
        System.out.println("currentHandle:" + webDriver.getWindowHandle());
    }

    private static WebDriver init() {

        //添加chrome 驱动
        System.setProperty("webdriver.chrome.driver"
                , "/Users/simonxue/Developer/tools/chromedriver");

        //-----------
        WebDriver webDriver = new ChromeDriver();
        //窗口全屏
        webDriver.manage().window().maximize();

        //删除所有Cookie
        webDriver.manage().deleteAllCookies();

        //webDriver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);

        return webDriver;
    }

    public static void main(String[] args) throws Exception {
        for (int i = 0; i < 100; i++) {
            autoMarkHomework();
            System.out.println("健康素养学习测评系统做 " + i + "遍");
        }

    }
}
