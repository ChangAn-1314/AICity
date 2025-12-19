# 前端素材需求清单与 AI 生成提示词

本项目主题为 **Cyberpunk / 智慧城市 / 舆情监控**。
主色调：Neon Cyan (#06b6d4), Deep Blue (#0f172a), Neon Purple (#a855f7)。
风格关键词：Holographic, HUD, Tech-UI, Data Visualization, Future.

以下是建议补充的素材及其生成提示词（可用于 Midjourney, Stable Diffusion, Dall-E 3 等）：

## 1. 品牌标识 (Brand Identity)

### 1.1 应用 Logo (App Logo)
*   **用途**: 顶部导航栏左侧，登录页。
*   **描述**: 结合大脑与城市的抽象图形，发光的科技感。
*   **Prompt**: 
    > A professional modern tech logo for a smart city platform "AI City". The design is a minimalist geometric abstraction fusing a human brain shape with a circuit board network. The lines utilize negative space to subtly hint at a city skyline. Style: Big Tech aesthetic, Paul Rand style, flat vector, clean geometry, bold lines. Colors: Neon cyan and deep blue on a white background. No complex details, no shading, scalable and iconic.
*   **建议尺寸**: 宽长比 3:1 (如 300x100px) 和 正方形 (Logo 图标)。

### 1.2 浏览器图标 (Favicon)
*   **用途**: 浏览器标签页。
*   **描述**: 极其简化的 Logo 核心元素（如一个发光的六边形或大脑节点）。
*   **Prompt**:
    > A minimalist tech symbol for an app icon. A single abstract geometric shape representing a digital node or brain synapse. Flat vector, solid neon cyan color on a dark navy background. High contrast, simple shapes, legible at 16x16 pixels. Big tech style.

## 2. UI 装饰元素 (HUD / Cyberpunk Elements)

### 2.1 面板边角装饰 (Panel Corners)
*   **用途**: 悬浮面板（舆情列表、详情页）的四个角落装饰，增强科技感。
*   **描述**: L 形的科技线条，带有刻度和光点。
*   **Prompt**:
    > Create a high-resolution L-shaped HUD corner element for a sci-fi game interface. It should be made of glowing neon cyan lines with small technical markings and data bits. The background must be transparent or solid black for easy removal. The design should be sleek, futuristic, and not overly cluttered.
*   **处理**: 生成后需扣除背景，切分为左上、右上、左下、右下四个部分。

### 2.2 科技感分割线 (Tech Separators)
*   **用途**: 分隔列表项或模块标题。
*   **描述**: 发光的水平线条，中间或两端有节点装饰。
*   **Prompt**:
    > Generate a futuristic UI divider line. It should be a horizontal glowing beam in neon cyan and blue, punctuated by small digital nodes and geometric shapes at the center and ends. The style is minimalist HUD, suitable for separating content sections in a dashboard.

### 2.3 背景纹理 (Global Background Pattern)
*   **用途**: 网页背景（非地图区域）或侧边栏背景。
*   **描述**: 极低对比度的六边形网格或电路板纹理，深色。
*   **Prompt**:
    > Create a seamless background pattern for a professional web dashboard. It should feature a dark navy blue hexagonal grid with very subtle, faint cyan circuit board lines running through it. The contrast should be low so it doesn't distract from the foreground content.

## 3. 功能图标 (Function Icons)

### 3.1 舆情分类图标 (Category Markers)
*   **用途**: 地图上的 3D Marker 贴图或列表图标。
*   **分类**: 
    1.  **交通 (Traffic)**: 拥堵或车辆。
    2.  **民生 (Livelihood)**: 人群或房屋。
    3.  **医疗/健康 (Health)**: 十字或心电图。
    4.  **安全 (Security)**: 盾牌或警示。
*   **Prompt (通用模板)**:
    > Create a 3D isometric glass-morphism icon representing [CATEGORY] for a cyberpunk map interface. The icon should have glowing neon [COLOR] outlines and a semi-transparent glass body. It needs to be simple and clear against a dark background.
    *   *Traffic*: "traffic jam, car" (Color: Orange)
    *   *Livelihood*: "community, people" (Color: Cyan)
    *   *Health*: "medical cross, heartbeat" (Color: Green)
    *   *Security*: "shield, warning exclamation" (Color: Red)

### 3.2 AI 助手头像 (AI Avatar)
*   **用途**: 智能分析模块的对话框头像。
*   **描述**: 抽象的 AI 虚拟形象，光球或数字面孔。
*   **Prompt**:
    > Generate a futuristic AI avatar for a digital assistant. It should be an abstract face formed from floating light particles and holographic data streams in shades of blue and purple. The expression should be friendly yet robotic, framed within a circular border, resembling high-end sci-fi movie visual effects.

## 4. 插画与空状态 (Illustrations & Empty States)

### 4.1 空数据状态 (No Data / Empty)
*   **用途**: 当列表为空时显示。
*   **描述**: 全息投影风格的“空盒子”或“搜索中”的雷达。
*   **Prompt**:
    > Create a UI illustration for an "empty state" screen. It should depict a holographic wireframe of an open, empty box with a few digital particles floating out, set against a dark background. The style is minimalist cyberpunk isometric 3D render in neon blue.

### 4.2 正在加载 (Loading Spinner)
*   **用途**: 数据加载中。
*   **描述**: 旋转的科技环或六边形。
*   **Prompt**:
    > Design a loading spinner animation frame. It should look like a futuristic sci-fi radar sweep or a glowing circle with rotating segmented rings in neon cyan. The background should be solid black. The style is clean vector graphics.

## 5. 地图特效贴图 (Map Textures)

### 5.1 地面标记环 (Ground Marker Ring)
*   **用途**: 选中热点时的地面光圈。
*   **描述**: 扩散的同心圆，带有科技刻度。
*   **Prompt**:
    > Create a top-down view of a sci-fi ground marker texture. It should consist of glowing concentric circles with HUD technical details and tick marks in neon cyan. The background should be transparent or black, designed to be used as a game asset for selecting units.

### 5.2 能量流动贴图 (Energy Flow Texture)
*   **用途**: 事件链连线的材质。
*   **描述**: 只有中间亮、两边透明的渐变光束，带有噪点或电光。
*   **Prompt**:
    > Generate a seamless texture of a horizontal laser beam or energy flow. It should have a bright white core fading into neon cyan edges, with subtle electric sparks. The background must be black. This is for a VFX trail effect.

## 总结
建议优先生成 **UI 边角装饰** 和 **AI 助手头像**，这两项能最快提升界面的“赛博朋克”完成度。图标目前可以使用 Lucide 库暂代，但自定义的 **3D 玻璃质感图标** 会更出彩。

## 6. Nano Banana Pro 提示词技巧 (Prompting Guide)

Nano Banana Pro (Gemini 3 Pro Image) 是新一代“思考型”模型，与传统的关键词堆砌（Tag Soup）不同，它更理解自然语言意图和上下文。

### 6.1 黄金法则 (The Golden Rules)

1.  **使用自然语言 (Natural Language)**
    *   ❌ **Bad**: `dog, park, 4k, realistic`
    *   ✅ **Good**: "A cinematic wide shot of a futuristic sports car speeding through a rainy Tokyo street at night. The neon signs reflect off the wet pavement and the car's metallic chassis."
    *   **技巧**: 像给人类艺术家下brief一样描述，使用完整的句子和正确的语法。

2.  **具体且有描述性 (Be Specific)**
    *   **主体**: 不要只说 "a woman"，试试 "a sophisticated elderly woman wearing a vintage chanel-style suit."
    *   **材质**: 明确质感，如 "matte finish" (哑光), "brushed steel" (拉丝钢), "soft velvet" (天鹅绒).
    *   **光影**: 描述光线来源和氛围，如 "cinematic lighting", "backlit", "soft morning light".

3.  **提供上下文 (Provide Context)**
    *   告诉模型**为什么**要生成这张图，或者它是**给谁看**的。
    *   **Example**: "Create an image of a sandwich **for a Brazilian high-end gourmet cookbook**." (模型会自动推断出专业的摆盘、浅景深和完美布光)。

4.  **编辑而非重抽 (Edit, Don't Re-roll)**
    *   如果生成的图有 80% 满意，不要重新生成。直接要求修改。
    *   **Example**: "That's great, but change the lighting to sunset and make the text neon blue."

### 6.2 结构控制 (Structural Control)

Nano Banana Pro 支持通过参考图严格控制布局：

*   **草图转成品 (Drafts & Sketches)**: 上传手绘草图，让模型严格按布局生成。
    *   *Prompt*: "Create a high-end magazine advertisement for a luxury perfume brand based on this hand-drawn sketch."
*   **线框图转 UI (Wireframes to UI)**: 上传 UI 线框图，生成高保真界面。
    *   *Prompt*: "Generate a photorealistic UI mockup for a fitness tracking app based on this wireframe. Replace placeholders with high-quality images."

### 6.3 针对本项目的应用 (Application for AI City)

*   **生成 HUD 边框**:
    *   *Prompt*: "A detailed technical drawing of a sci-fi HUD corner element, white lines on black background, high contrast, intended for a transparent UI overlay in a video game."
*   **生成 3D 图标**:
    *   *Prompt*: "A 3D isometric icon of a smart city surveillance camera, glass and metal materials, glowing neon cyan accents, studio lighting, isolated on a dark background, best for app icon."
