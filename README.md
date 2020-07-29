# lerna-practice
learning lerna

### 初始

在git上新建一个 `lerna-practice` 的仓库，并安装lerna

```zsh
git clone https://github.com/your-repo

cd lerna-practice

```

**注意:** 如果你是windows的话，请先看下面**异常-1**，将`.editorconfig`配置到项目中，vscode的话还需要安装好插件，不然后续可能会无法进行下去，并且可能调整好比较麻烦。

```zsh
// 全局安装lerna
yarn global add lerna

// 初始化lerna
lerna init
```

这个时候，你项目中会初始化`lerna.json`, `package.json`两个文件，以及`packages`这个文件夹。

对于一些lerna的配置我们可以写到`lerna.json`中，比如我们希望`lerna`默认时候yarn对管理`node_modules`

```json
{
  // 改为使用yarn，默认是npm
  "npmClient": "yarn",
  "packages": [
    "packages/*"
  ],
  "version": "0.0.0"
}
```

### 新建需要管理的包
我们可以在`packages`文件夹下，新建我们之后要管理的包。例如 `zerrol-lerna-demo-module-1`和`zerrol-lerna-demo-module-2`。这里因为我们待会会将包上传的npm仓库，所以名字可以稍微复杂一点。

我们假设`module-1`是一个封装了lodash的包，然后`module-2`依赖`module-1`，在`module-1`的基础上新增了一下新的方法。

```zsh
cd packages
mkdir zerrol-lerna-demo-module-1
mkdir zerrol-lerna-demo-module-2

cd zerrol-lerna-demo-module-1 
npm init -y
yarn add lodash

cd zerrol-lerna-demo-module-2
npm init -y
```

### 依赖管理

假设我们`module-2`需要依赖`module-1`，

一种方案是，我们可以手动在`module-2`的package.json中加入`module-1`的依赖，然后运行`lerna bootstrap`，

`lerna bootstrap` 会对这个项目`packages`下的包做升级和安装依赖(相对于对每一个包做`npm install`)，如果lerna发现你依赖的包是本地项目中的话，就不是去远程仓库找，而是自动将本地的包生成一个软链挂在`node_modules`中，可以大大的方便调试和开发。

```json
"dependencies": {
  "zerrol-lerna-demo-module-1": "1.0.0"
}
```

另一种方案是，可以使用以下命令，会直接将我们`module-2`的package.json中加入`module-1`的依赖

```zsh
lerna add zerrol-lerna-demo-module-1 --scope=zerrol-lerna-demo-module-2
```

接下来你就可以修改在`module-1`中`index.js`的代码，然后你就会发现`module-2`的`node_modules`中代码也会一起更新拉。

### 项目发布

lerna可以帮助直接将所有的包进行升级，并一键发布到npm仓库中。首先需要登录你的npm账号

```zsh
// 如果你有使用淘宝源的话，一定要记得先切换回npm
nrm use npm

// 如果没有账号的话可以先去官网注册
npm login
```

将你这次改动先提交到git

```
git add .
git commit -m 'first commit'
git push
```

然后就可以输入`lerna publish`一键发布啦，lerna的命令行工具会提示你选择更新版本号，并将外部的和`packages`中的package.json和互相依赖的包的版本都行更新。然后将代码提交到git，然后自动发布到npm仓库中。

当你看到 `lerna success published` 的提示之后就说明发布成功啦，你可以随便新增个项目运行 `yarn add zerrol-lerna-demo-module-2`，将可以将包拉下了。你也可以登录到自己npm账号，进去到自己的仓库，看到刚刚两个包都已经发布成功了。


### 异常

#### 1. lf 和 crlf 问题
在使用windows的时候，git 会警告lf和crlf冲突的情况，当git出现warn的时候，lerna publish也会失败。

这里不建议直接设置 `autocsrf = false`，因为这样会导致`git diff`没有办法正常检索。

建议加入`.editorconfig`在项目中， 然后在vscode安装`editorconfig`插件。这个插件会根据你的配置，在你修改文件的时候，将一些默认行为进行修改。

```
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
```

#### 2. publish 最后一步失败

如果 `lerna publish` 最后一步，推送到npm仓库失败了，比如忘记登录npm或者忘记把源换回来了，这个时候version已经被更换了，并且代码已经被提交到git了。如果登录后再publish一遍的话，又需要更新版本号。所以可以使用 `lerna publish from-package`

解决方案：
```
// 有时候可能lerna新增了一些其他的改动，先重置掉
git reset --hard

lerna publish from-package
```





