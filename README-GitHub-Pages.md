# 蛇口逃生OS：GitHub Pages 部署说明

这个项目已经是纯静态网页，可以直接部署到 GitHub Pages。

## 你要上传的内容

把整个目录一起上传：

- `index.html`
- `assets/`
- `.nojekyll`

## 最简单的做法

### 方案 A：新建一个仓库，直接用根目录发布

1. 打开 GitHub，创建一个新仓库。
2. 把 `mini_arcade` 文件夹里的内容全部上传到仓库根目录。
3. 进入仓库页面，点击 `Settings`。
4. 左侧点击 `Pages`。
5. 在 `Build and deployment` 里：
   - `Source` 选择 `Deploy from a branch`
   - `Branch` 选择 `main`
   - 文件夹选择 `/ (root)`
6. 保存。
7. 等几分钟后，GitHub 会给你一个网址。

网址通常像这样：

`https://你的用户名.github.io/仓库名/`

### 方案 B：如果你想放在已有仓库里

把这个游戏单独放到一个子目录也可以，但最稳妥的方式仍然是单独一个仓库。

## 上传后怎么测试

1. 用电脑打开 GitHub Pages 网址。
2. 再用 iPhone / iPad 的 Safari 打开同一个网址。
3. 如果页面没更新，强制刷新一次。

## 建议

- 手机和平板请用 `Safari` 打开。
- 不要直接从聊天软件里点本地 `html` 附件。
- 如果要发给朋友，直接发 GitHub Pages 网址最好。

## 备用方案

如果你不想自己点 GitHub 页面设置，我也可以下一步继续帮你：

1. 整理一个“最适合上传”的发布包目录
2. 给你一套 Git 命令，直接复制粘贴就能推到 GitHub
3. 帮你改成更适合 Pages 分享的首页版本
