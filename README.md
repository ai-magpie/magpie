<!-- 本文件由 scripts/build.mjs 从 data/ 自动生成，请勿直接编辑；修改 data/ 后运行 `npm run build`。 -->

# Magpie

> 收集散落各处的 AI 工具与资源，让好东西被看见。

**[在线浏览](https://ai-magpie.github.io/magpie/)**

Magpie 是一份人工策展的 AI 工具清单，关注能真正进入工作流的项目。每个条目都经过筛选，只保留可用的链接与一句话说明。

## 目录

- [大模型](#大模型)
- [视频生成模型](#视频生成模型)
- [图像生成模型](#图像生成模型)
- [语音与音乐](#语音与音乐)
- [3D 与数字人](#3d-与数字人)
- [模型平台](#模型平台)
- [本地模型与推理](#本地模型与推理)
- [编程 Agent](#编程-agent)
- [AI 编辑器](#ai-编辑器)
- [Agent 开发框架](#agent-开发框架)
- [Agent Skills](#agent-skills)
- [MCP 生态](#mcp-生态)
- [AI 搜索](#ai-搜索)
- [知识库与 RAG](#知识库与-rag)
- [办公与通用 Agent](#办公与通用-agent)
- [学习资源](#学习资源)
- [模型目录与榜单](#模型目录与榜单)

## 大模型

语言与多模态基座模型家族，按厂商收录官方入口，不追具体版本号。

- [OpenAI GPT](https://platform.openai.com/docs/models) — 覆盖通用对话、推理与多模态的模型家族，API 与 ChatGPT 同源。
- [Anthropic Claude](https://docs.anthropic.com/en/docs/about-claude/models/overview) — 长上下文与工具调用见长，在编程和长程 Agent 任务中使用广泛。
- [Google Gemini](https://deepmind.google/models/gemini/) — 原生多模态模型家族，支持超长上下文与图像、音频、视频输入。
- [Meta Llama](https://www.llama.com/models/) — 开源权重模型家族，社区微调与本地部署生态丰富。
- [Mistral](https://docs.mistral.ai/) — 欧洲厂商，提供开源权重与商用模型，覆盖文本、代码与多模态。
- [DeepSeek](https://api-docs.deepseek.com/) — 开源权重模型，分 Pro 与 Flash 两档，长上下文与代码能力突出。
- [阿里 Qwen](https://qwen.ai/) — 多尺寸开源权重家族，兼有闭源旗舰，中英文与代码场景覆盖广。
- [Moonshot Kimi](https://platform.moonshot.ai/docs) — 长上下文与 Agent 能力见长，提供 API 与办公场景产品。
- [Z.ai GLM](https://docs.z.ai/) — 智谱的 GLM 家族，以开源权重和 Agent 场景为主，提供 API 服务。
- [MiniMax](https://platform.minimaxi.com/) — 文本、语音与视频多模态模型，提供面向开发者的 API。
- [xAI Grok](https://docs.x.ai/) — 强调实时信息与推理的模型家族，提供 API 与消费级产品。
- [ByteDance Seed](https://seed.bytedance.com/) — 字节跳动的模型品牌，豆包系列覆盖文本、图像与视频生成。

## 视频生成模型

文生视频与图生视频模型，兼顾闭源产品与可自部署的开源权重。

- [OpenAI Sora](https://openai.com/sora) — 面向镜头叙事与物理一致性的视频生成产品，支持原生音频与故事板。
- [Google Veo](https://deepmind.google/models/veo/) — 原生音视频生成，强调镜头控制与画面一致性。
- [快手 Kling](https://klingai.com/) — 支持较长时长、多模态参考与镜头控制，面向创作者。
- [ByteDance Seedance](https://seed.bytedance.com/en/seedance) — 支持文、图、音、视频混合参考，强调运动与主体一致性。
- [阿里 Wan](https://wan.video/) — 开源权重与托管服务并行，覆盖文生视频与图生视频。
- [MiniMax Hailuo](https://hailuoai.video/) — 人物表演与镜头运动见长，提供网页端与 API。
- [Runway](https://runwayml.com/) — 面向影视与广告的创作套件，含生成、编辑与后期工具。
- [Luma Dream Machine](https://lumalabs.ai/dream-machine) — 快速迭代的视频生成产品，强调自然运镜与一致角色。
- [Pika](https://pika.art/) — 轻量特效与短视频生成，适合社交媒体内容。
- [Lightricks LTX](https://ltx.studio/) — 开源权重视频模型，支持较快生成与本地部署。
- [腾讯 HunyuanVideo](https://github.com/Tencent-Hunyuan/HunyuanVideo) — 开源权重视频生成模型，支持本地推理与二次开发。
- [Genmo Mochi](https://github.com/genmoai/mochi) — 开源权重视频模型，适合研究与自部署实验。

## 图像生成模型

文生图与图像编辑模型，覆盖闭源产品与开源权重的代表家族。

- [Midjourney](https://www.midjourney.com/) — 以审美风格著称的文生图产品，支持参考图与风格控制。
- [ChatGPT Images](https://platform.openai.com/docs/guides/image-generation) — OpenAI 的图像生成产品，API 侧以 GPT Image 提供，擅长文字渲染与指令遵循。
- [Gemini Image](https://deepmind.google/models/gemini-image/) — Google 的 Gemini 图像模型，Nano Banana 系列以多轮编辑与角色一致性见长。
- [ByteDance Seedream](https://seed.bytedance.com/en/seedream) — 字节跳动的图像生成模型，支持文字渲染、多图参考与批量生成。
- [Recraft](https://www.recraft.ai/) — 面向品牌与矢量图形的生成工具，擅长图标、插画与一致风格。
- [Ideogram](https://ideogram.ai/) — 以文字排版和海报生成为特色的图像模型。
- [Adobe Firefly](https://www.adobe.com/products/firefly.html) — 集成在 Adobe 创意工具中的生成模型，强调商用授权与素材工作流。
- [Krea](https://www.krea.ai/) — 面向创作者的实时生成与放大工具，支持风格参考与局部编辑。
- [FLUX](https://bfl.ai/) — Black Forest Labs 的图像模型家族，开源权重与托管 API 并行。
- [Stable Diffusion](https://stability.ai/) — Stability AI 的开源权重图像模型，社区微调与工具链成熟。
- [Qwen-Image](https://github.com/QwenLM/Qwen-Image) — 阿里通义的开源图像模型，中文文字渲染与图像编辑见长。
- [HunyuanImage](https://github.com/Tencent-Hunyuan/HunyuanImage-3.0) — 腾讯的开源图像生成模型，支持中英文提示词与高质量出图。

## 语音与音乐

语音合成、语音识别与音乐生成模型，兼顾实时 API 与可自部署方案。

- [ElevenLabs](https://elevenlabs.io/) — 语音合成与克隆平台，支持多语言、情感控制与实时流式输出。
- [Cartesia](https://cartesia.ai/) — 低延迟语音合成模型，面向实时对话与语音 Agent。
- [Deepgram](https://deepgram.com/) — 语音识别与合成 API，主打低延迟与电话场景。
- [Inworld TTS](https://inworld.ai/tts) — 面向游戏与角色对话的语音合成，强调情感与表演控制。
- [MiniMax Audio](https://www.minimax.io/audio) — 语音合成与克隆服务，支持多语言与长文本。
- [Fish Audio](https://fish.audio/) — 开源语音合成模型与托管服务，支持声音克隆。
- [OpenAI Audio](https://platform.openai.com/docs/guides/speech-to-text) — OpenAI 的语音合成与识别接口，覆盖实时对话与转写。
- [Whisper](https://github.com/openai/whisper) — OpenAI 开源的语音识别模型，可本地部署与微调。
- [Suno](https://suno.com/) — 文生音乐平台，可生成含人声与编曲的完整歌曲。
- [Udio](https://www.udio.com/) — 文生音乐平台，强调编曲质量与分段续写。
- [Stable Audio](https://stableaudio.com/) — Stability AI 的音频生成模型，支持音效与音乐片段。
- [Lyria](https://deepmind.google/models/lyria/) — Google 的音乐生成模型家族，面向配乐与音效生成。

## 3D 与数字人

从文本或图片生成 3D 资产，以及数字人视频；含开源权重方案。

- [Meshy](https://www.meshy.ai/) — 文本/图片生成 3D 模型，覆盖游戏资产与 3D 打印。
- [Hyper3D Rodin](https://hyper3d.ai/) — 高质量 3D 资产生成，支持文本与图片输入。
- [腾讯 Hunyuan3D](https://github.com/Tencent-Hunyuan/Hunyuan3D-2.1) — 腾讯的开源 3D 生成模型，支持纹理与几何生成。
- [TRELLIS](https://github.com/microsoft/TRELLIS.2) — 微软的开源 3D 生成模型，从图片重建带纹理的资产。
- [Tripo](https://www.tripo3d.ai/) — 面向游戏与电商的 3D 资产生成，支持文本与图片输入。
- [Stable Fast 3D](https://github.com/Stability-AI/stable-fast-3d) — Stability AI 的开源图生 3D 模型，强调生成速度。
- [HeyGen](https://www.heygen.com/) — 数字人视频平台，支持形象克隆、口型同步与多语言配音。
- [Synthesia](https://www.synthesia.io/) — 企业级数字人视频平台，主打培训与营销场景。

## 模型平台

托管 API、推理服务与云平台，按接入方式收录。

- [OpenRouter](https://openrouter.ai/) — 统一路由多家模型，按量计费，适合快速比较多模型效果。
- [Together AI](https://www.together.ai/) — 托管开源模型与微调服务，提供兼容 OpenAI 的接口。
- [Fireworks AI](https://fireworks.ai/) — 面向生产环境的推理服务，强调低延迟与模型微调。
- [Groq](https://groq.com/) — 自研 LPU 推理硬件，主打低延迟的文本与语音模型服务。
- [Cerebras](https://www.cerebras.ai/) — 晶圆级芯片推理，适合超高速生成场景。
- [Baseten](https://www.baseten.co/) — 模型部署与推理平台，支持自定义模型与自动扩缩容。
- [Replicate](https://replicate.com/) — 以社区模型为特色的托管推理，覆盖图像、视频与音频。
- [fal.ai](https://fal.ai/) — 面向生成式媒体的推理平台，图像与视频模型接入快。
- [DeepInfra](https://deepinfra.com/) — 按 token 计费的开源模型推理服务，价格透明。
- [硅基流动 SiliconFlow](https://siliconflow.cn/) — 国内模型 API 平台，聚合开源与国产模型。
- [Amazon Bedrock](https://aws.amazon.com/bedrock/) — AWS 的托管模型服务，统一接入多家厂商模型。
- [Google Vertex AI](https://cloud.google.com/vertex-ai) — Google Cloud 的模型与 Agent 平台，托管 Gemini 等模型。
- [Azure AI Foundry](https://azure.microsoft.com/en-us/products/ai-foundry) — 微软的模型与 Agent 平台，托管 OpenAI 及第三方模型。
- [Vercel AI Gateway](https://vercel.com/ai-gateway) — 统一网关，按请求路由多家模型并集中计费。
- [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/) — 边缘运行时上的模型推理，适合轻量、低延迟场景。
- [火山方舟](https://www.volcengine.com/product/ark) — 字节跳动的模型服务平台，托管豆包与 Seed 系列。
- [阿里百炼](https://www.aliyun.com/product/bailian) — 阿里云的模型与应用平台，托管通义与第三方模型。
- [ModelScope 魔搭](https://modelscope.cn/) — 国内模型社区与托管平台，提供模型下载与在线推理。

## 本地模型与推理

在自己的机器或集群上运行开源模型，兼顾隐私、成本与可控性。

本地运行适合隐私敏感数据、离线场景与低成本实验；显存与量化格式通常比参数量更影响实际体验。

- [Ollama](https://ollama.com) — 一条命令在本地运行开源模型，并提供常用 REST 接口。
- [llama.cpp](https://github.com/ggml-org/llama.cpp) — C/C++ 推理引擎，支持 GGUF 量化与多平台部署。
- [vLLM](https://github.com/vllm-project/vllm) — 高吞吐推理与服务引擎，核心是 PagedAttention。
- [SGLang](https://github.com/sgl-project/sglang) — 面向高并发服务的推理框架，提供 RadixAttention 等优化。
- [LM Studio](https://lmstudio.ai) — 桌面端本地模型运行器，带图形界面与本地 API。
- [MLX](https://github.com/ml-explore/mlx) — Apple 为自家芯片设计的数组框架，支持本地训练与推理。

## 编程 Agent

在终端或编辑器里自主执行开发任务的代理，覆盖开箱即用产品与可自托管方案。

- [Claude Code](https://claude.com/product/claude-code) — Anthropic 的终端编程代理，可读取仓库、执行命令并修改代码。
- [OpenAI Codex CLI](https://github.com/openai/codex) — OpenAI 的开源终端编码代理，支持沙箱执行与审批。
- [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness) — DeepSeek 的 Agent harness，支持 Skills、MCP、子 Agent 与插件。
- [Aider](https://aider.chat) — 在终端里与 LLM 结对编程，自动生成并提交 Git 变更。
- [OpenHands](https://github.com/All-Hands-AI/OpenHands) — 开源自主编程 Agent，可在沙箱中执行多步开发任务。
- [Goose](https://github.com/block/goose) — Block 开源的本地 Agent，支持扩展与多模型接入。
- [opencode](https://github.com/sst/opencode) — 开源的终端编程 Agent，提供 TUI 与多模型切换。
- [Gemini CLI](https://github.com/google-gemini/gemini-cli) — Google 的终端 Agent，可调用 Gemini 并执行本地操作。
- [Qwen Code](https://github.com/QwenLM/qwen-code) — 阿里开源的终端编程 Agent，适配 Qwen 系列模型。
- [Cline](https://cline.bot) — VS Code 内的自主编程 Agent，可规划并执行多步任务。
- [Amp](https://ampcode.com/) — Sourcegraph 推出的编程 Agent，强调代码库级理解。
- [Crush](https://github.com/charmbracelet/crush) — Charm 的终端编程 Agent，界面与交互体验见长。

## AI 编辑器

把 AI 内置到编辑器与 IDE 的产品，强调补全、对话与跨文件编辑。

- [Cursor](https://cursor.com) — AI 优先的代码编辑器，支持跨文件编辑与 Agent 模式。
- [Windsurf](https://windsurf.com/) — 内置 Agent 的编辑器，强调上下文感知与多步任务。
- [GitHub Copilot](https://github.com/features/copilot) — GitHub 的 AI 编程助手，覆盖补全、对话与代码审查。
- [Continue](https://continue.dev) — 开源 IDE 编程助手，可接入自有模型或本地模型。
- [Zed](https://zed.dev/) — 高性能协作编辑器，内置 AI 补全与 Agent 面板。
- [Trae](https://www.trae.ai/) — 字节跳动的 AI IDE，提供中文场景与 Agent 模式。
- [Kiro](https://kiro.dev/) — AWS 的 AI IDE，以规格驱动开发与任务拆解为特色。

## Agent 开发框架

构建、编排与部署 Agent 的库与运行时，从单 Agent 循环到多 Agent 工作流。

- [LangGraph](https://github.com/langchain-ai/langgraph) — 以图结构编排有状态 Agent，支持持久化与人工介入。
- [CrewAI](https://github.com/crewAIInc/crewAI) — 面向多 Agent 协作的框架，用角色与任务描述工作流。
- [AutoGen](https://github.com/microsoft/autogen) — 微软的多 Agent 对话框架，用于构建可协作的智能体系统。
- [Microsoft Agent Framework](https://learn.microsoft.com/en-us/agent-framework/) — 微软的 Agent 开发框架，覆盖 .NET 与 Python，支持多 Agent 工作流。
- [OpenAI Agents SDK](https://github.com/openai/openai-agents-python) — 轻量多 Agent 框架，提供任务交接、护栏与追踪。
- [Google ADK](https://github.com/google/adk-python) — Google 的 Agent 开发套件，支持工具、多 Agent 与部署。
- [AWS Strands](https://github.com/strands-agents/sdk-python) — AWS 的模型驱动 Agent SDK，强调工具调用与多 Agent。
- [PydanticAI](https://ai.pydantic.dev) — Pydantic 团队的类型安全 Agent 框架，强调结构化输出。
- [smolagents](https://github.com/huggingface/smolagents) — Hugging Face 的轻量框架，以代码执行作为 Agent 动作。
- [LlamaIndex](https://github.com/run-llama/llama_index) — 面向私有数据的 LLM 应用框架，擅长索引与检索。
- [Mastra](https://mastra.ai/) — TypeScript 优先的 Agent 框架，内置工作流、记忆与评测。
- [DSPy](https://dspy.ai/) — 用声明式程序优化提示与流程，适合可评测的 LLM 管线。

## Agent Skills

把可复用能力封装成 SKILL.md 的规范、注册表与合集；不逐个收录技能包。

- [Agent Skills 规范](https://agentskills.io/specification) — SKILL.md 的字段、目录结构与加载规则，跨工具通用的能力封装格式。
- [anthropics/skills](https://github.com/anthropics/skills) — Anthropic 官方技能示例与 skill-creator，可作为编写模板。
- [Claude Code Skills 文档](https://code.claude.com/docs/en/skills) — Claude Code 中技能的位置、发现机制与调用方式。
- [skills.sh](https://skills.sh/) — Vercel 维护的技能注册表与安装 CLI，可浏览和分发技能。
- [awesome-claude-skills](https://github.com/Chat2AnyLLM/awesome-claude-skills) — 社区维护的技能索引，按来源仓库汇总可发现的 SKILL.md。
- [obra/superpowers](https://github.com/obra/superpowers) — 面向工程流程的技能合集，覆盖规划、调试与协作。
- [DSH Skills](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/subsystems/skills.zh.md) — DSH 的技能子系统文档，说明技能发现、加载与调用方式。

## MCP 生态

Model Context Protocol 的规范、注册表、目录与开发工具；不逐个收录 Server。

- [MCP 官方文档](https://modelcontextprotocol.io/) — 协议规范、SDK 与接入指南的入口。
- [MCP Registry](https://registry.modelcontextprotocol.io/) — 官方 Server 注册表，可按命名空间检索与发布。
- [Smithery](https://smithery.ai/) — MCP Server 目录与托管服务，支持一键接入客户端。
- [mcp.so](https://mcp.so/) — 社区维护的 MCP Server 索引，按场景与客户端筛选。
- [Glama MCP](https://glama.ai/mcp/servers) — 可检索并对比 MCP Server 的目录，提供接入信息。
- [awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers) — 社区精选 Server 列表，按语言与用途分类。
- [FastMCP](https://github.com/jlowin/fastmcp) — 用 Python 快速编写 MCP Server 的框架。
- [MCP Inspector](https://github.com/modelcontextprotocol/inspector) — 调试 MCP Server 的官方工具，可查看工具与消息。
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) — 官方 TypeScript SDK，用于实现 Server 与 Client。

## AI 搜索

面向 AI 应用的搜索与抓取 API，以及带引用的答案引擎。

- [Perplexity](https://www.perplexity.ai/) — 带引用的 AI 搜索与答案引擎，提供消费级产品与 API。
- [Exa](https://exa.ai/) — 面向 AI 的语义搜索 API，支持按内容与链接检索。
- [Tavily](https://tavily.com/) — 为 Agent 设计的搜索 API，返回可直接使用的结果摘要。
- [Brave Search API](https://brave.com/search/api/) — 独立索引的搜索 API，适合替代通用搜索引擎接口。
- [Jina AI](https://jina.ai/) — 网页读取、搜索与向量化工具，常用于 RAG 数据准备。
- [Firecrawl](https://www.firecrawl.dev/) — 把网页抓取并转换为 Markdown 的 API，适合喂给 LLM。
- [Kagi](https://kagi.com/) — 付费无广告搜索引擎，提供 API 与可定制结果。
- [Context7](https://context7.com/) — 为编程助手提供最新文档与代码示例的检索服务。

## 知识库与 RAG

搭建知识库与 RAG 的工具链，从文档解析到检索与编排。

- [Dify](https://dify.ai/) — 开源的低代码 Agent 与 RAG 平台，支持可视化工作流。
- [RAGFlow](https://ragflow.io/) — 开源的 RAG 引擎，擅长复杂文档解析与检索。
- [FastGPT](https://fastgpt.io/) — 轻量的知识库与 Agent 平台，部署简单、接口兼容 OpenAI。
- [Haystack](https://haystack.deepset.ai/) — deepset 的 RAG 编排框架，支持检索、生成与评测。
- [GraphRAG](https://github.com/microsoft/graphrag) — 微软的图谱增强检索方案，适合全局性问题的知识组织。
- [R2R](https://github.com/SciPhi-AI/R2R) — 开源的 RAG 引擎与 API，支持多模态文档与 Agent 检索。
- [Qdrant](https://qdrant.tech/) — 开源向量数据库，支持过滤、混合检索与分布式部署。
- [Unstructured](https://unstructured.io/) — 文档解析与切分工具，把 PDF、HTML 等转成结构化数据。

## 办公与通用 Agent

面向日常工作的 AI 产品，以及可自主执行多步任务的通用 Agent。

- [NotebookLM](https://notebooklm.google.com/) — 基于资料的 AI 笔记与研究助手，可生成摘要、问答与音频概览。
- [Notion AI](https://www.notion.com/product/ai) — Notion 内置的 AI 写作、检索与数据库助手。
- [Gamma](https://gamma.app/) — 用提示词生成演示文稿、文档与网页，支持模板与品牌样式。
- [Canva](https://www.canva.com/) — 在线设计平台，内置文生图、抠图与版式生成等 AI 能力。
- [Manus](https://manus.im/) — 通用 Agent 产品，可分解任务并调用工具完成多步工作。
- [Genspark](https://www.genspark.ai/) — 通用 Agent 与搜索产品，可生成报告、幻灯片与网页。
- [Granola](https://www.granola.ai/) — 面向会议的 AI 笔记工具，结合本地音频与手写笔记生成纪要。
- [Otter](https://otter.ai/) — 会议转写与纪要工具，支持实时字幕与行动项提取。
- [Microsoft 365 Copilot](https://www.microsoft.com/en-us/microsoft-365/copilot) — Office 应用与 Teams 中的 AI 助手，覆盖文档、邮件与会议。
- [Google Workspace Gemini](https://workspace.google.com/solutions/ai/) — Gmail、Docs、Meet 等 Workspace 应用中的 Gemini 助手。

## 学习资源

系统学习大模型与 Agent 的课程、论文与通讯，偏长期价值而非工具。

- [DeepLearning.AI](https://www.deeplearning.ai/) — 吴恩达团队的 AI 课程平台，覆盖 LLM、Agent 与工程实践。
- [Hugging Face Learn](https://huggingface.co/learn) — Hugging Face 的免费课程与教程，覆盖 NLP、Agent 与模型部署。
- [fast.ai](https://www.fast.ai/) — 面向实践者的免费深度学习课程，强调自顶向下学习。
- [Karpathy Zero to Hero](https://karpathy.ai/zero-to-hero.html) — 从零实现语言模型的系列课程，适合理解 LLM 原理。
- [arXiv](https://arxiv.org/) — 预印本论文库，cs.CL 与 cs.AI 是追踪模型进展的主要来源。
- [Latent Space](https://www.latent.space/) — 面向 AI 工程师的播客与通讯，关注工程实践与产品落地。

## 模型目录与榜单

查询模型能力、价格与排名的上游数据源，用来校准清单而非替代清单。

- [LMArena](https://lmarena.ai/) — 基于人类对战投票的模型排名，偏主观体验。
- [Artificial Analysis](https://artificialanalysis.ai/) — 对比模型质量、速度与价格，适合选型。
- [models.dev](https://models.dev/) — 开源的模型与提供商元数据库，含上下文、价格与能力标记。
- [Hugging Face](https://huggingface.co/models) — 开源模型与数据集的集散地，可查权重、许可与下载量。
- [Ollama Library](https://ollama.com/library) — 可直接 ollama run 的模型清单，适合本地试跑。
- [SWE-bench](https://www.swebench.com/) — 真实仓库 Issue 的编程评测，衡量 Agent 修 bug 能力。

## 贡献

发现遗漏或失效的条目，欢迎提交 PR。请保持一节一条、按主题归类，并附上一句话说明它解决什么问题。提交前运行 `npm run format` 统一格式。

编辑 `data/sections/` 下的 JSON 文件后运行 `npm run build` 重新生成 README，不要直接修改本文件。

提交前可运行 `npm run check:links` 抽查外链，失效链接请替换或移除。

## 许可

[MIT](LICENSE) © ai-magpie
