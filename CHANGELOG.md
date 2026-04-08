# Changelog

All notable changes to this project will be documented in this file.

## 2.0.4 (2026-04-08)

### Features
- **plugin**: register ink file extension

### Chores
- **deps**: switch from jsdom to esbuild and add clean script
- **ci**: switch build tool from Node.js to Bun
- **deps**: upgrade dependencies and clean up dev dependencies
- **ci**: update release workflow to use release notes from changelog
- **changelog**: regenerate with correct tag references

**Full Changelog**: https://github.com/uglyboy-tl/obsidian-ink-player/compare/2.0.1...2.0.4

## 2.0.1 (2026-03-31)

### Bug Fixes
- **ci**: upgrade Node.js to 22.x in release workflow

**Full Changelog**: https://github.com/uglyboy-tl/obsidian-ink-player/compare/2.0.0...2.0.1

## 2.0.0 (2026-03-31)

### Features
- **autosave**: implement automatic save and restore functionality
- **commands**: add command system
- **autosave**: implement automatic save and restore functionality
- **components**: add InkWeave components

### Bug Fixes
- **release**: correct branch name in release script

### Refactoring
- **components**: refactor InkWeave components
- **utils**: refactor utility functions and compiler
- **settings**: refactor settings system with separate tab
- **styles**: refactor styles to modular css
- **session**: remove legacy session restore flag and logic
- **utils**: migrate to @inkweave utilities
- **components**: remove legacy Ink components
- **core**: migrate plugin architecture to @inkweave

### Documentation
- **i18n**: update translation files
- **i18n**: add autosave slot translation keys

### Styles
- **css**: update styles for InkWeave components

### Tests
- **mocks**: update obsidian mock for testing

### Chores
- **release**: add release automation scripts and changelog
- **deps**: update dependencies and package structure
- **tooling**: replace eslint with biome
- **build**: migrate from esbuild to vite
- **tests**: remove legacy test file
- **deps**: migrate to @inkweave libraries

**Full Changelog**: https://github.com/uglyboy-tl/obsidian-ink-player/compare/1.2.1...2.0.0

## 1.2.1 (2026-03-23)

### Chores
- **manifest**: bump version to 1.2.1

**Full Changelog**: https://github.com/uglyboy-tl/obsidian-ink-player/compare/1.2.0...1.2.1

## 1.2.0 (2026-03-23)

### Features
- session persistence, modal UX fixes, storage bugfixes
- **i18n**: add Polish locale, improve EN/ZH settings descriptions
- **i18n**: add Polish locale, improve EN/ZH settings descriptions
- **i18n**: add Polish locale, improve EN/ZH settings descriptions
- **settings**: 添加新设置项并优化国际化
- **i18n**: 添加国际化支持并升级依赖

### Bug Fixes
- **deps**: bump @types/node to ^20.0.0 for vitest 4.x compatibility
- **session**: prevent double compiledStory() race in view.setState()
- **session**: use useContents.subscribe() for reliable auto-save
- **ui**: rewrite save/restore modal with custom styles
- **ui**: add section dividers, restyle choices, fix locale issues
- **ui**: rewrite save/restore modal with custom styles
- **ui**: add section dividers, restyle choices, fix locale issues
- **ui**: add section dividers, restyle choices, fix locale issues
- resolve intermittent ink story activation failures

### Performance
- **ink-story**: prevent duplicate initialization with useRef

### Refactoring
- **plugin**: improve markdown content reading logic
- **session**: extract SESSION_RESTORE_FLAG constant
- **constants**: rename INK_DIVIDER to CHOICE_SEPARATOR for clarity
- **components**: 优化 InkContents 组件中的可见行数逻辑
- **ink**: 优化标签和选择解析器的清除功能

### Styles
- **i18n**: unify tag format in translations
- **error-message**: unify error message dash format

### Tests
- **session**: add full simulation round-trip and real useStory tests

**Full Changelog**: https://github.com/uglyboy-tl/obsidian-ink-player/compare/1.1.0...1.2.0

## 1.1.0 (2025-03-18)

### Features
- **插件系统**: 实现插件热更新机制
- **plugin**: 添加 Ink Story 插件设置功能
- **autosave**: 添加自动保存功能

### Refactoring
- **fadeforline**: 优化行延迟设置逻辑
- **ink**: 重构 Ink 组件和故事逻辑
- **ink**: 重构游戏存档和故事管理功能
- **ink**: 重构 Ink 组件和 hooks
- **组件**: 重构 Ink 组件并优化滚动逻辑
- **components**: 重构 InkChoices 和 InkContents 组件

### Build
- **版本号**: 更新版本号至 1.1.0

**Full Changelog**: https://github.com/uglyboy-tl/obsidian-ink-player/compare/1.0.2...1.1.0

## 1.0.2 (2025-03-11)

### Refactoring
- 优化代码结构和变量声明

### Build
- **ink-player**: 更新版本号至 1.0.2

**Full Changelog**: https://github.com/uglyboy-tl/obsidian-ink-player/compare/1.0.1...1.0.2

## 1.0.1 (2025-03-11)

### Refactoring
- 重构 Ink Player 插件

**Full Changelog**: https://github.com/uglyboy-tl/obsidian-ink-player/compare/1.0.0...1.0.1

## 1.0.0 (2025-03-11)

### Features
- **components**: 实现内容淡入效果并优化故事展示逻辑
- **story**: 重构故事标签处理系统
- **plugin**: 添加设置选项并优化插件功能

### Bug Fixes
- **components**: 修复 InkScreen 组件中的 InkChoices 渲染问题

### Refactoring
- **save**: 重构存储模块并优化记忆卡功能
- **ink**: 重构 Ink 组件和库
- **ink**: 重构 InkStory 和音频处理逻辑
- **ink**: 重构 Ink 相关组件和 hooks
- **components**: 优化组件样式和结构
- **ink**: 重构 Ink 解析逻辑

### Documentation
- **README**: 更新文档以匹配 Ink Player 插件

**Full Changelog**: https://github.com/uglyboy-tl/obsidian-ink-player/compare/0.1.0...1.0.0

## 0.1.0 (2025-03-08)

### Features
- **story**: 优化音频资源管理
- **plugin**: 优化资源路径处理并添加存档功能
- 创建 Ink Player 插件

### Refactoring
- **layout**: 优化页面布局和滚动功能
- **hooks**: 重构 file hook 并添加资源路径功能
- **error**: 重构错误处理逻辑并引入 Ink.js 类型定义
