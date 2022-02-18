这是ChinaVis2020数据可视分析挑战赛，四川大学（温啸林、张馨艺、刘尚松、李长林、吴美璇）队伍的作品《基于模糊聚类的大气污染时空态势可视分析系统》，该作品获挑战赛优秀作品奖。

比赛官网链接：http://www.chinavis.org/2021/challenge.html


## 作品实现
![image](https://user-images.githubusercontent.com/29750316/154602050-9ef8c5c5-e5af-45fd-a1eb-785dd549a6b4.png)

## 作品简介

本作品以“大气污染时空态势分析”为主要切入点，融合每日大气分析数据和 POI 信息，结合“大气污染时空态势分析”、“大气污染源分析”、“大气污染传输模式分析”3个主题，针对大气污染防治部门数据分析人员，讨论分析目标，并设计了相应的交互式可视分析流程。结合大气分析模型，设计、改进了一系列视图，并提出了一种基于临域的空间模糊聚类算法以支持以上分析目标。在实现的基于模糊聚类的大气污染时空态势可视分析系统中，通过案例研究验证了以上方法的有效性，有望为大气污染防治工作的分析、指挥和决策提供有效手段和决策依据。具体而言：
  
本作品允许用户先整体观察大气污染时空演化态势，在不同粒度下探索分析，再结合多视图联动与交互手段进一步地比较地域相关性，分析传播模式、污染源及污染成因。可视化设计方面，本作品设计了“快照+动画+多图层”的大气污染可视分析方法，总体采用“快照+动画”形式有效呈现污染的时空变化特性，同时允许用户基于分析意图自由切换“传输模式图”、“污染物时空分布蜂窝图”和“聚类中心热力图”三个图层，再结合“AQI 等级流图”和“区域对比视图”等辅助视图进行细节分析。为更有效地呈现时空传播模式，本作品还提出一种新颖的基于临域的空间模糊聚类算法，通过度量传输概率和污染物相似度，将平
铺的采样点自底向上的聚合为多个污染发生区域。再结合上述可视化方法，能有效识别污染来源和传播态势。同时，该聚类算法能降低可视化渲染成本和信息负担，使本作品更有望在真实场景中发挥应用价值。

## 数据介绍
面向大气污染成因分析，本工作通过位置信息融合了官方提供的每日分析数据（日均值数据）和高德地图兴趣点 POI 数据。每日分析数据通过 ChinaVis2021 官方数据接口下载，高德地图兴趣点 POI 数据来自北京大学开放研究数据平台。

## 分析任务

本作品以“大气污染时空态势分析”为主要切入点，融合每日大气分析数据和 POI 信息，结合“大气污染时空态势分析”、“大气污染源分析”、“大气污染传输模式分析”3个主题，针对大气污染防治部门数据分析人员，设立以下分析目标：

* G1. 有效监测大气污染发展趋势
* G2. 快速感知污染时空态势及传播模式
* G3. 分析污染源及污染成因

进一步具体定义了 6 类分析任务：

* T1 大气污染时空分布模式 呈现各类污染物浓度的地理空间分布以及时间演化过程
* T2 监控大气污染时空演变态势 支持分地区分时段的多粒度污染时空演变态势探索
* T3 比较大气污染差异 支持比较不同时段和地区下污染传输模式和时空分布的差异
* T4 识别主要传输模式 支持呈现聚类算法结果，快速识别主要传输模式
* T5 识别主要大气污染源 支持快速定位主要污染时段和地区
* T6 分析关键污染成因 结合自然气象与 POI 数据，支持污染成因细节分析

## 可视分析总体流程

1. 以标记总体污染水平的折线时间轴为分析入口，锁定感兴趣的时间区间；
2. 以“动画+快照”形式观察主视图，结合六边形统计流图，快速感知污染整体时空态势；
3. 点击快照并切换图层，识别污染源，分析污染传播模式和地域相关性；
4. 点选六边形地区，比较不同区域污染物差异，结合 POI 统计数据分析污染成因
![image](https://user-images.githubusercontent.com/29750316/154602623-db09a74e-7f0e-410c-aa1d-3771a3fa10b1.png)


## 作品技术栈
* D3.js
* React
* 高德地图 API
* sklearn
* flask

## 运行

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In the project directory, you can run:

#### `npm start`
#### `npm test`
#### `npm run build`
#### `npm run eject`
