"""
app/core/prompts.py

Centralized Prompt Library
AI Legal Documentation Platform

Every AI endpoint should import prompts from this file.
Never hardcode prompts anywhere else.
"""

from langchain_core.prompts import PromptTemplate


# ============================================================
# SYSTEM PROMPT
# ============================================================

LEGAL_SYSTEM_PROMPT = """
You are SATURDAY.

SATURDAY is an AI-powered Legal Documentation Assistant.

Your Responsibilities:

- Analyze legal documents accurately.
- Never hallucinate.
- Never invent clauses.
- Never invent dates.
- Never assume missing information.
- Use ONLY the provided document.
- Explain legal language in simple English.
- Stay professional and neutral.
- If information is unavailable,
  clearly mention it.

VERY IMPORTANT:

Return ONLY valid JSON.

DO NOT:

- Return markdown
- Return ```json
- Explain outside JSON
- Add comments
- Add notes

Your response MUST be directly parsable using Python json.loads().
"""


# ============================================================
# JSON RULE
# ============================================================

JSON_RULE = """

Return ONLY valid JSON.

Do not wrap inside markdown.

Do not write explanations.

Do not use ```json.

Output only JSON.

"""


# ============================================================
# HELPER
# ============================================================

def build_prompt(template: PromptTemplate, **kwargs):

    """
    Automatically inject the system prompt.

    Usage:

    prompt = build_prompt(
        SUMMARY_PROMPT,
        document=text
    )
    """

    return template.format(
        system_prompt=LEGAL_SYSTEM_PROMPT,
        json_rule=JSON_RULE,
        **kwargs
    )


# ============================================================
# CONTRACT ANALYSIS
# ============================================================

CONTRACT_ANALYSIS_PROMPT = PromptTemplate.from_template(
"""
{system_prompt}

Analyze the following legal document.

Document:

{document}

{json_rule}

Return JSON in this exact schema.

{{
    "contract_type":"",
    "parties":[],
    "effective_date":"",
    "expiration_date":"",
    "governing_law":"",
    "main_purpose":"",
    "important_obligations":[],
    "key_deadlines":[],
    "legal_risks":[]
}}
"""
)


# ============================================================
# SUMMARY
# ============================================================

SUMMARY_PROMPT = PromptTemplate.from_template(
"""
{system_prompt}

Summarize the following legal document.

Document:

{document}

Maximum 200 words.

{json_rule}

Return

{{
    "summary":"",
    "key_points":[
        "",
        "",
        ""
    ]
}}
"""
)


# ============================================================
# CLAUSE EXTRACTION
# ============================================================

CLAUSE_EXTRACTION_PROMPT = PromptTemplate.from_template(
"""
{system_prompt}

Extract every important legal clause.

Document:

{document}

{json_rule}

Return

{{
    "clauses":[
        {{
            "title":"",
            "description":"",
            "importance":"",
            "risk_level":""
        }}
    ]
}}
"""
)


# ============================================================
# CLAUSE EXPLANATION
# ============================================================

CLAUSE_EXPLANATION_PROMPT = PromptTemplate.from_template(
"""
{system_prompt}

Explain the following legal clause.

Clause:

{clause}

Context:

{document}

{json_rule}

Return

{{
    "title":"",
    "meaning":"",
    "legal_importance":"",
    "risk_level":"",
    "simple_explanation":""
}}
"""
)


# ============================================================
# RISK ANALYSIS
# ============================================================

RISK_ANALYSIS_PROMPT = PromptTemplate.from_template(
"""
{system_prompt}

Analyze the legal risks.

Document:

{document}

{json_rule}

Return

{{
    "overall_risk_score":0,

    "risks":[
        {{
            "title":"",
            "severity":"",
            "reason":"",
            "recommendation":""
        }}
    ]
}}
"""
)


# ============================================================
# CHAT (RAG)
# ============================================================

CHAT_PROMPT = PromptTemplate.from_template(
"""
{system_prompt}

Answer ONLY from the provided context.

Context:

{context}

Question:

{question}

If the answer is unavailable,

say so.

{json_rule}

Return

{{
    "answer":""
}}
"""
)


# ============================================================
# DASHBOARD
# ============================================================

DASHBOARD_PROMPT = PromptTemplate.from_template(
"""
{system_prompt}

Generate dashboard insights.

Document:

{document}

{json_rule}

Return

{{
    "contract_type":"",
    "total_clauses":0,
    "high_risk":0,
    "medium_risk":0,
    "low_risk":0,
    "overall_risk_score":0,
    "recommendation":""
}}
"""
)


# ============================================================
# VOICE
# ============================================================

VOICE_PROMPT = PromptTemplate.from_template(
"""
{system_prompt}

You are speaking directly to the user.

Context:

{context}

Question:

{question}

Speak naturally.

Maximum 120 words.
"""
)