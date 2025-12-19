# 智舆项目策划书 - LaTeX版本

## 格式规范

已按照模板要求设置字体和字号：

| 元素 | 字体 | 字号 | LaTeX命令 |
|------|------|------|-----------|
| 目录标题 | 宋体 | 二号(22pt) | `\songti\erhao` |
| 章标题(一、项目概述) | 微软雅黑 | 三号(16pt) | `\yahei\sanhao` |
| 节标题(1.1 项目简介) | 微软雅黑 | 四号(14pt) | `\yahei\sihao` |
| 正文内容 | 宋体 | 四号(14pt) | `\songti\sihao` |

## 文件结构

```
paper/
├── main.tex              # 主文件
├── chapters/
│   ├── cover.tex         # 封面
│   ├── chapter1.tex      # 第一章 项目概述
│   ├── chapter2.tex      # 第二章 项目内容
│   ├── chapter3.tex      # 第三章 项目可行性
│   ├── chapter4.tex      # 第四章 项目市场分析
│   ├── chapter5.tex      # 第五章 项目营销策略
│   └── appendix.tex      # 附录
└── README.md             # 本文件
```

## 编译方法

### 方法一：使用XeLaTeX编译(推荐)

```bash
xelatex main.tex
xelatex main.tex  # 运行两次以生成正确的目录
```

### 方法二：使用latexmk

```bash
latexmk -xelatex main.tex
```

### 方法三：使用VS Code + LaTeX Workshop

1. 安装VS Code扩展 `LaTeX Workshop`
2. 打开 `main.tex`
3. 按 `Ctrl+Alt+B` 编译
4. 按 `Ctrl+Alt+V` 预览PDF

### 方法四：使用Overleaf

1. 上传所有文件到Overleaf项目
2. 设置编译器为 `XeLaTeX`
3. 点击编译

## 依赖要求

- TeX发行版：TeX Live 2020+ 或 MiKTeX
- 编译器：XeLaTeX
- 中文支持：ctex宏包
- 字体：需要系统安装中文字体(SimSun、SimHei等)

## 待补充内容

1. **团队信息**：在 `chapters/cover.tex` 中填写团队名称和成员
2. **图片**：在标注 `[图X：...]` 的位置插入对应图片
3. **附录C**：在 `chapters/appendix.tex` 中填写具体成员信息

## 图片插入方法

在需要插入图片的位置，将 `figurebox` 环境替换为：

```latex
\begin{figure}[H]
\centering
\includegraphics[width=0.8\textwidth]{images/图片文件名.png}
\caption{图片标题}
\end{figure}
```

建议创建 `images/` 文件夹存放所有图片。

## 常见问题

1. **编译报错找不到字体**：确保系统安装了中文字体，或在ctexart选项中指定字体
2. **目录不显示**：需要编译两次
3. **图片不显示**：检查图片路径是否正确

## 输出

编译成功后将生成 `main.pdf` 文件。
