# Douban-Info-for-PT

## 关于

为国外PT站增加中文信息，数据源来自于豆瓣。

目前支持`PTP` `BTN` `HDB` `KG` `BHD` `FL` `PHD` `BLU` `ACM` `HDT` `IPT` `TL` `Aither` `AvistaZ` `iTS` `SC` `ANT` `AR` `HDF` `HDS`。

## 就地融合

`BHD` `ACM` `BLU` `FL` `HDT` `AR` `BTN` `HDB` `HDF` `HDS` `iTS` `IPT` 十二个站不改动站点原有内容，只在旁边挂上豆瓣信息，风格跟随站点自身样式：

- **中文片名**：保留站内原片名和原链接，中文片名跟在原片名右侧，点击中文片名跳转对应豆瓣条目（`HDB` 片名中的年份会挪到中文片名之后，如 `The Kite Runner 追风筝的人 (2007)`）。`FL` 详情页本身没有片名，中文片名加在简介上方；`AR` 加在文件信息下方，字号颜色与文件信息一致；`BTN` 横幅保持站点原样，在横幅下方新增一行中文片名（后接原英文片名与年份），样式与站内原生标题一致；`HDF` 中文片名插在原片名与 `[年份]` 之间，颜色与原片名一致；`HDS` `iTS` 中文片名跟在原片名右侧并带上年份，如 `The Martian 火星救援 (2015)`；`IPT` 中文片名插在原片名与年份之间，如 `谍之心 Heart of Stone (2023)`。
- **中文简介**：豆瓣有中文简介时替换原英文简介，鼠标悬停可查看原文；豆瓣没有中文简介（或只有占位文案）时保留站点原简介。`BTN` 的中文简介加在 Series Summary 最上端，带豆瓣图标标签，样式与站内其他简介面板一致。
- **豆瓣评分**：加在站点自身的评分栏里，沿用站点原评分徽章的样式，点击跳转豆瓣条目。`HDB` 把原 `Rating` 改名为 `IMDB Rating`，下一行增加 `DouBan Rating`；`BTN` 在 `TVDB Rating` 下方增加 `DouBan Rating`；`HDS` 在 `Rating` 行下方增加 `DouBan Rating`，沿用站点自身的星级图；`iTS` 增加 `DouBan Rating` 行，用豆瓣「豆」logo 加评分；`HDF` 在 Infos 的评分行里 IMDb 旁增加豆瓣评分徽章；`HDT` 把原星级图评分改成 `IMDB：6.5/10（Votes: 38716）`（票数取自站点自身的 `Votes` 行，该行随即删除），豆瓣评分换行放在下一行并带上豆瓣评价人数；`IPT` 的 IMDb 与豆瓣评分收进同一个右对齐评分组，片名留在原位，IMDb 评分与片名同行在上，豆瓣评分固定换行放在 IMDb 正下方且两行左边缘对齐，评分框内的标识、评分、星级、评价数均复用站点自身样式；`FL` 站内原有评分未标注来源，补上 `IMDb` 来源名称，上映日期、IMDb、豆瓣三个评分保持同一行，放不下时自动缩小评分字号。
- **豆瓣入口按钮**：加在站点自身的外部链接按钮（TMDB / IMDb 那一排）里，样式与相邻按钮一致。`iTS` 的豆瓣链接加在 `Link` 行的 IMDb 链接右边，沿用站点的 redir 跳转与外链文字样式；`BHD` 的豆瓣按钮加在 `TVDB` 按钮右边，文字为 `DOUBAN`，有条目时为可点击的明亮按钮，没有豆瓣条目时为不可点击的暗色按钮；`IPT` 的豆瓣按钮加在 TMDB / IMDb 按钮旁，豆瓣绿底色与相邻按钮同风格。

影片没有豆瓣条目时，片名和简介均使用网站原有内容。

## 效果图

### BHD（beyond-hd.me）

中文片名位于原片名右侧，评分栏 TVDB 按钮右边增加 DOUBAN 链接按钮，剧情简介替换为豆瓣中文简介。

![](/assets/bhd.jpg)

### ACM（eiga.moi）

中文片名位于原片名右侧，评分行增加豆瓣评分，外链按钮行增加豆瓣入口按钮，剧情简介替换为豆瓣中文简介。

![](/assets/acm.jpg)

### HDT（hd-torrents.org）

中文片名位于原片名右侧，站点评分改为 IMDB 评分并带上票数，豆瓣评分换行显示在其下方，剧情简介替换为豆瓣中文简介。

![](/assets/hdt.jpg)

### IPT（iptorrents.com）

中文片名插在原片名与年份之间，IMDb 与豆瓣评分在右侧两行对齐显示，外链按钮行增加豆瓣入口按钮，剧情简介替换为豆瓣中文简介。

![](/assets/ipt.jpg)

### BTN（broadcasthe.net）

横幅下方新增中文片名行，Series Summary 顶部增加豆瓣中文简介，Series Info 增加 DouBan Rating 与豆瓣外链按钮。

![](/assets/btn.jpg)

### HDB（hdbits.org）

中文片名位于原片名右侧，Rating 更名为 IMDB Rating 并增加 DouBan Rating 行，剧情简介替换为豆瓣中文简介。

![](/assets/hdb.jpg)

## 安装

[安装地址](https://greasyfork.org/zh-CN/scripts/410851-douban-info-for-pt)

## 注意事项

在脚本安装完成后，第一次访问种子详情页，会有一个弹框询问是否允许豆瓣的跨域请求，选择 *总是允许此域名* 即可。

![](/assets/cors.png)

## 声明

如需使用本脚本，请注明来源，谢谢合作！