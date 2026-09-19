# 321出埃及记讲义

出埃及记全书四十章：逐节原文解经、讲章逐字稿、教学讲章、321 生命应用。

线上版：**https://spch321-sudo.github.io/321exodus-sc/**

## 这个 repo 里有什么

```
index.html              整支 App（含全部讲义与教学讲章，约 4.7 MB）
manifest.webmanifest    PWA 设定：名称、图示、启动画面颜色
sw.js                   Service Worker，让 App 离线也能读
icons/                  图示（32／64／120／152／167／180／192／512／1024）
favicon.ico             浏览器分页图示
.nojekyll               告诉 GitHub Pages 不要用 Jekyll 处理档案
404.html                任何找不到的网址都导回 App
```

`index.html` 是**单一档案**：经文、逐节解经、讲章、教学讲章、321 应用、
争议议题、附录、封面主视觉全部在里面，不连任何 CDN，也没有外部字型。
所以它下载一次就能永久离线使用。

## App 里有什么

架构、操作方式与功能，与《321创世记讲义》完全一致。

底下五格：**今日｜经文｜课程｜工具｜我的**

每一章七格分页：**卡片｜核心｜小组｜讲章｜讲义｜操练｜把关**

- **讲义**就是四十课的教学讲章：十一节全文、想更深可收合、
  小组讨论分享三个化，可开**全荧幕**逐段带读
- **工具**六样：搜寻、原文轨迹（5 条）、争议地图（262 组）、
  全书地形图、金句复习（间隔重复）、讲台把关总览
- **朗读**：真人语音（Azure）＋装置内建语音，可挑声音与语速，背景播放
- **画线与领受**：长按选字画线、五色、写领受、可汇出
- **小智**：陪读小帮手，带着本章的经文与解经上下文回答
- **繁／简**一键切换，**加到主画面**后离线可读

## 怎么发布（三选一）

### 一、网页上传，最省事

1. 到 GitHub 开一个新的 repository，名字建议 `321exodus-sc`，选 **Public**
2. 进去按 **Add file → Upload files**，把这个资料夹里的**全部档案**拖进去
   （包含 `icons` 资料夹与 `.nojekyll`；若拖曳时看不到 `.nojekyll`，
   改用 **Add file → Create new file**，档名就打 `.nojekyll`，内容留空）
3. 按 **Commit changes**
4. 进 **Settings → Pages**，Source 选 **Deploy from a branch**，
   分支选 `main`、资料夹选 `/ (root)`，按 **Save**
5. 等一到两分钟，网址就会出现在同一页上

### 二、用指令列

```bash
cd 321exodus-sc                      # 这个资料夹
git init
git add -A
git commit -m "321出埃及记讲义 App"
git branch -M main
git remote add origin https://github.com/spch321-sudo/321exodus-sc.git
git push -u origin main
```

推上去之后一样要去 **Settings → Pages** 把来源设成 `main` / `/ (root)`。

### 三、更新内容时

把新的 `index.html` 盖上去，重新 commit 就好。
`sw.js` 里的版本字串每次重新打包都会变，使用者一开启就会自动换成新版，
不需要叫他们清除快取。

## 手机上「加到主画面」

- **iPhone**：用 Safari 打开网址 → 分享键 → 加入主画面
- **Android**：用 Chrome 打开网址 → 右上角选单 → 安装应用程式／加到主画面

加完之后图示会出现在桌面，开起来没有网址列，跟一般 App 一样，而且可以离线读。

## 授权与内容

- 圣经经文采用**和合本**
- 讲义内容为 321 圣经讲义・出埃及记，40 章／1,213 节／解经 429 区块／讲章 40 篇／教学讲章 40 课／争议议题 262 条／附录 8 篇，合计 108 万汉字
