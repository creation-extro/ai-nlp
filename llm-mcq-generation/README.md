# 🧠 LLM-Based MCQ Generation Engine

## Overview

This module serves as the core intelligence layer for generating high-quality educational assessments.
It leverages **Google’s Gemini API (Gemini 3 Pro)** and structured NLP techniques to produce context-aware,
schema-validated Multiple Choice Questions (MCQs) suitable for backend integration.

The design prioritizes **pedagogical correctness**, **output determinism**, and **API safety**.

---

## 🎯 Core Capabilities

### Pedagogical Alignment
Generates MCQs aligned with **Bloom’s Taxonomy** (Recall, Application, Analysis) to ensure balanced cognitive
difficulty across assessments.

### Misconception-Based Distractors
Implements distractor logic based on common learner errors (e.g., off-by-one indexing mistakes),
reducing guesswork and improving assessment quality.

### Strict Schema Validation
Enforces a **locked JSON schema** to guarantee predictable outputs and prevent frontend or API parsing failures.

### Prompt Engineering & QA
Uses optimized prompt structures with grounding rules and negative constraints to minimize hallucinations,
ambiguity, and schema violations.

---

## 📂 Module Structure

```text
llm-mcq-generation/
├── prompts/    # Optimized system prompts (V2 & V3)
├── schema/     # Locked JSON schema (backend contract)
├── samples/    # Validated MCQ output examples
└── reports/    # Optimization logs, QA metrics, and handover docs
```

## ⚙️ Configuration & Integration Notes
This module is optimized for **deterministic, production-grade outputs**.

| Parameter | Setting | Rationale |
| :--- | :--- | :--- |
| Model | **Gemini 3 Pro** | Utilizes latest reasoning & long-context windows |
| Temperature | **0.2** | Low randomness for consistency and schema safety |
| Output | **JSON Object** | Directly consumable by backend services |

## 👨‍💻 Contributor
**Arya** – LLM Content Generation & NLP

### Responsibilities:
* MCQ generation logic
* Prompt optimization & QA guardrails
* Bloom’s taxonomy alignment
* JSON schema validation and handover

## ✅ Status
**Production-ready.**      
Validated using real transcript chunks and finalized for backend integration.
