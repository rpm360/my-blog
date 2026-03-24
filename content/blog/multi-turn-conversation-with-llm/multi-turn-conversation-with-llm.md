---
title: "Multi-Turn Conversation with LLM"
description: "A detailed guide on structuring multi-turn conversations with Large Language Models for optimal results, focusing on topic management and framework design."
date: 2026-03-24
tags:
  - llm
  - prompt-engineering
  - multi-turn
  - dialog-management
---

# Multi-Turn Conversation with LLM

In this post, we will discuss various methods available for handling multi-turn conversations with Large Language Models (LLMs).

With the release of early systems like "Launch Pad," we achieved some level of multi-turn conversation. However, a key question remains: How should the system act and interact?

Currently, most LLM-based experiences act by collecting client information and acknowledging the user with specific responses. Guardrails often prevent the LLM from going off-topic, sticking rigidly to engineered prompts. However, there are limitations:

- **Time limits**: Often limited to 2 minutes; increasing this can make the LLM go "off the rails."
- **Task/Goal support**: Current implementations often lack clear task or goal handling.
- **Topic handling**: There's often no explicit mechanism for topic switching or management.

Let's explore ways to tackle these limitations and achieve longer, more coherent conversations using **Dialog Management**.

---

## LLM-Based Agent Framework

One promising approach is a specialized Large Language Model (LLM) tailored for **Goal-Oriented Dialogue (GOD)**, which is particularly effective in complex diagnostic scenarios like medical or legal consultations. Unlike general chatbots, a specialized system can proactively guide users toward specific outcomes by managing dialogue topics and maintaining state.

### The Framework

The framework consists of four main components:
1. **Thinking Topic Development**
2. **Maintaining Topic Stack**
3. **Enriching Topic**
4. **Generating Response**

#### 1. Thinking Topic Development

When starting a conversation, the first step is picking a topic. The system analyzes the user's query and decides the main topic for the current round of dialogue. 

**How it works:**
- Receives user query.
- Analyzes previous dialogue context to identify user interest.
- Influences conversation direction for a relevant, engaging response.

#### 2. Maintaining Topic Stack

Imagine juggling several conversation threads—talking about a project, planning a meetup, and discussing a movie. Maintaining a "stack" allows the system to track these threads and switch between them without losing context.

**How it works:**
- Maintains a "stack" of topics discussed.
- Adds new topics to the top; removes resolved or irrelevant ones.
- Manages the flow, ensuring all points are addressed smoothly.

#### 3. Enriching Topic

This adds details to make the conversation more engaging. For example, if discussing soccer, enrichment might include player stats or notable moments.

**How it works:**
- Looks for ways to add relevant details to a chosen topic.
- Pulls in background info, related topics, or deeper insights.
- Keeps the user engaged with comprehensive context.

#### 4. Generating Response

The final step is forming the reply based on the topic, enriched information, and context.

**How it works:**
- Combines the current topic, enriched info, and history.
- Uses rules and models to advance the conversation toward user goals.
- Considers user preferences and tone for a natural feel.

---

## Example: Collect Basic User Information

### Task Definition

```json
{
    "task_name": "Collect Basic User Information",
    "overview": "Collecting essential personal and contact information from a user to create or update their profile.",
    "goal": "Accurately collect and record all necessary user information",
    "checklist": [
        "Ask for user's full name",
        "Request date of birth for eligibility",
        "Inquire about email address",
        "Collect phone number for urgent queries",
        "Ask for home address",
        "Confirm data consent",
        "Summarize info for verification",
        "Provide confirmation number"
    ]
}
```

### Sample Chat History

> **User:** Collect Basic User Information
> 
> **Virtual Assistant:** Thank you for reaching out. May I have your full name, please?
> 
> **User:** My full name is Rohit Marathe
> 
> **Virtual Assistant:** Thank you, Rohit. May I also ask for your date of birth for eligibility verification?
> 
> **User:** Yeah sure, I was born on 25 Aug 1995
> 
> **Virtual Assistant:** Thank you. May I have your email address for communication?
> 
> **User:** rt@gmail.com
> 
> **Virtual Assistant:** And your phone number for urgent inquiries?
> 
> **User:** 407-666-7637
> 
> **Virtual Assistant:** Lastly, what is your residential address?
> 
> **User:** 520 E Church St, Orlando 32801

---

## Agent Prompt Templates

### Topic Manager Prompt

```text
MANAGE_TOPIC_PROMPT = """Your objective is to manage dialogue topics between an AI expert and a user.
The topics should stay within the relevant field.
You have a topic list: {topic_list}.
Current topic: {current_topic}.
Tools: {tool_description}.
"""
```

### Enricher Prompt

```text
ENRICH_TOPIC_PROMPT = """Your objective is to enrich dialogue topics.
I will give an original topic and you will provide an enriched version (max 120 words).
Ensure the AI expert can understand it easily to improve the dialogue.
"""
```

### Chat Prompt Template

```text
CHAT_PROMPT_TEMPLATE = """You are a famous expert who guides users through their demands.
Focus on the current topic: {current_topic}.
- If topic starts with 'Ask user:', ask concretely.
- If topic starts with 'Answer user:', provide a theoretical answer, specific suggestions, and follow-up clarification questions.
- If 'Complete goal:', give a comprehensive final answer.
"""
```

---

*Multi-turn conversation remains a challenging but exciting field in LLM development. By implementing structured topic management, we can move beyond simple Q&A to truly intelligent, goal-oriented assistants.*
