# Douban-Info-for-PT

## 关于

为国外PT站增加中文信息，数据源来自于豆瓣。

目前支持`PTP` `BTN` `HDB` `KG` `BHD` `FL` `PHD` `BLU` `ACM` `HDT` `IPT` `TL` `Aither` `AvistaZ` `bB` `iTS` `SC` `Bdc` `ANT` `AR` `HDF` `HDS`。

## 就地融合

`BHD` `ACM` `BLU` `FL` `HDT` `AR` `BTN` `HDB` `HDF` `HDS` `iTS` 十个站不改动站点原有内容，只在旁边挂上豆瓣信息，风格跟随站点自身样式：

- **中文片名**：保留站内原片名和原链接，中文片名跟在原片名右侧，点击中文片名跳转对应豆瓣条目（`HDB` 片名中的年份会挪到中文片名之后，如 `The Kite Runner 追风筝的人 (2007)`）。`FL` 详情页本身没有片名，中文片名加在简介上方；`AR` 加在文件信息下方，字号颜色与文件信息一致；`BTN` 横幅保持站点原样，在横幅下方新增一行中文片名（后接原英文片名与年份），样式与站内原生标题一致；`HDF` 中文片名插在原片名与 `[年份]` 之间，颜色与原片名一致；`HDS` `iTS` 中文片名跟在原片名右侧并带上年份，如 `The Martian 火星救援 (2015)`。
- **中文简介**：豆瓣有中文简介时替换原英文简介，鼠标悬停可查看原文；豆瓣没有中文简介（或只有占位文案）时保留站点原简介。`BTN` 的中文简介加在 Series Summary 最上端，带豆瓣图标标签，样式与站内其他简介面板一致。
- **豆瓣评分**：加在站点自身的评分栏里，沿用站点原评分徽章的样式，点击跳转豆瓣条目。`HDB` 把原 `Rating` 改名为 `IMDB Rating`，下一行增加 `DouBan Rating`；`BTN` 在 `TVDB Rating` 下方增加 `DouBan Rating`；`HDS` 在 `Rating` 行下方增加 `DouBan Rating`，沿用站点自身的星级图；`iTS` 增加 `DouBan Rating` 行，用豆瓣「豆」logo 加评分；`HDF` 在 Infos 的评分行里 IMDb 旁增加豆瓣评分徽章。
- **豆瓣入口按钮**：加在站点自身的外部链接按钮（TMDB / IMDb 那一排）里，样式与相邻按钮一致。`iTS` 的豆瓣链接加在 `Link` 行的 IMDb 链接右边，沿用站点的 redir 跳转与外链文字样式。

影片没有豆瓣条目时，片名和简介均使用网站原有内容。

## 安装

[安装地址](https://greasyfork.org/zh-CN/scripts/410851-douban-info-for-pt)

## 注意事项

在脚本安装完成后，第一次访问种子详情页，会有一个弹框询问是否允许豆瓣的跨域请求，选择 *总是允许此域名* 即可。

![](/assets/cors.png)

## 声明

如需使用本脚本，请注明来源，谢谢合作！