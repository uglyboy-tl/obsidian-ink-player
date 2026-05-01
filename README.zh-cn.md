# Obsidian 的 Ink Player 插件

[English](./README.md) | 中文

这是一个开源的 Obsidian 插件，用于游玩由 Inkle 的 [ink](https://www.inklestudios.com/ink/) 引擎驱动的互动小说，专为网页游戏设计。

您可以在[这里](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md)找到 ink 的基础教程。

感谢 [Calico](https://elliotherriman.itch.io/calico)，本插件提供了丰富的新功能，包括自定义标签、完整的移动设备兼容性、游戏存档和高级解析。

## 安装

1.  在 Obsidian 中，导航至 `设置` → `社区插件` → `浏览`。
2.  搜索 `Ink Player` 并选择 Ink Player 插件。
3.  点击 `安装`。
4.  点击 `启用`。

## 使用

1.  打开一个 Ink 脚本文件。
2.  使用 `激活 Ink Story` 命令（可通过命令面板或专用 Ribbon 按钮访问）。
3.  享受您的故事！

## 贡献

本插件是 [InkWeave](https://github.com/uglyboy-tl/InkWeave) 单体仓库的一部分，依赖于 `@inkweave/core`、`@inkweave/react` 和 `@inkweave/plugins`。

-   克隆 InkWeave 仓库。
-   运行 `git submodule update --init` 拉取插件源码。
-   运行 `bun install` 安装依赖。
-   运行 `bun run build:obsidian` 构建插件。
-   运行 `bun check` 进行 lint 和类型检查。
