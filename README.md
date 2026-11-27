<!-- 本文件由 scripts/build.mjs 从 data/ 自动生成，请勿直接编辑；修改 data/ 后运行 `pnpm build`。 -->

# Magpie

> 收集散落各处的 AI 工具与资源，让好东西被看见。

**[在线浏览](https://ai-magpie.github.io/magpie/)**

Magpie 是一份人工策展的 AI 工具清单，关注能真正进入工作流的项目。每个条目都经过筛选，只保留可用的链接与一句话说明。

## 目录

- [AI 编程助手](#ai-编程助手)
- [Agent 框架与协议](#agent-框架与协议)
- [本地模型与推理](#本地模型与推理)

## AI 编程助手

把需求、代码库与终端交给模型的项目，覆盖补全、结对编程与自动化改码。

- [Claude Code](https://claude.com/product/claude-code) — Anthropic 的终端编程代理，可读取仓库、执行命令并修改代码。
- [Cursor](https://cursor.com) — AI 优先的代码编辑器，支持跨文件编辑与 Agent 模式。
- [GitHub Copilot](https://github.com/features/copilot) — GitHub 的 AI 编程助手，覆盖补全、对话与代码审查。
- [OpenAI Codex CLI](https://github.com/openai/codex) — OpenAI 的开源终端编码代理，支持沙箱执行与审批。
- [Aider](https://aider.chat) — 在终端里与 LLM 结对编程，自动生成并提交 Git 变更。
- [Cline](https://cline.bot) — 开源 VS Code 代理，可在编辑器内规划并执行多步任务。
- [Continue](https://continue.dev) — 开源 IDE 编程助手，可接入自有模型或本地模型。

## Agent 框架与协议

构建、编排与连接智能体的基础设施，从单 Agent 循环到多 Agent 协作。

- [LangGraph](https://github.com/langchain-ai/langgraph) — 以图结构编排有状态 Agent，支持持久化与人工介入。
- [CrewAI](https://github.com/crewAIInc/crewAI) — 面向多 Agent 协作的框架，用角色与任务描述工作流。
- [AutoGen](https://github.com/microsoft/autogen) — 微软的多 Agent 对话框架，用于构建可协作的智能体系统。
- [OpenAI Agents SDK](https://github.com/openai/openai-agents-python) — 轻量多 Agent 框架，提供任务交接、护栏与追踪。
- [Model Context Protocol](https://modelcontextprotocol.io) — 开放协议，用统一方式把工具与数据接入模型应用。
- [PydanticAI](https://ai.pydantic.dev) — Pydantic 团队的类型安全 Agent 框架，强调结构化输出。
- [LlamaIndex](https://github.com/run-llama/llama_index) — 面向私有数据的 LLM 应用框架，擅长索引与检索。

## 本地模型与推理

在自己的机器或集群上运行开源模型，兼顾隐私、成本与可控性。

本地运行适合隐私敏感数据、离线场景与低成本实验；显存与量化格式通常比参数量更影响实际体验。

- [Ollama](https://ollama.com) — 一条命令在本地运行开源模型，并提供常用 REST 接口。
- [llama.cpp](https://github.com/ggml-org/llama.cpp) — C/C++ 推理引擎，支持 GGUF 量化与多平台部署。
- [vLLM](https://github.com/vllm-project/vllm) — 高吞吐推理与服务引擎，核心是 PagedAttention。
- [SGLang](https://github.com/sgl-project/sglang) — 面向高并发服务的推理框架，提供 RadixAttention 等优化。
- [LM Studio](https://lmstudio.ai) — 桌面端本地模型运行器，带图形界面与本地 API。
- [MLX](https://github.com/ml-explore/mlx) — Apple 为自家芯片设计的数组框架，支持本地训练与推理。

## 贡献

发现遗漏或失效的条目，欢迎提交 PR。请保持一节一条、按主题归类，并附上一句话说明它解决什么问题。

编辑 `data/sections/` 下的 JSON 文件后运行 `pnpm build` 重新生成 README，不要直接修改本文件。

## 许可

[MIT](LICENSE) © ai-magpie
