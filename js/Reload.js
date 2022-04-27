/*
Author：Pysta
GitHub Link:https://github.com/mieqq/mieqq
* [Panel]
* 配置重载 = title=配置重载,content=配置重载,style=info,script-name=配置重载,update-interval=-1
* [Script]
* 配置重载=script-path=https://raw.githubusercontent.com/TributePaulWalker/Profiles/main/JavaScript/Surge/Profile-Reload.js,type=generic
*/

$httpAPI("POST", "/v1/profiles/reload", {}, data => {
    $notification.post("Reload","Reload Successfully","")
    $done({
        title: "Reload",
        content: "Reload Successfully",
        icon: "arrow.counterclockwise.icloud.fill",
        "icon-color": "#FF9500",
     })
    });