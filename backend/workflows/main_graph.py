from typing import TypedDict, Annotated, Literal
from langgraph.graph import StateGraph, START, END
from backend.agents.llm import llm_service
from backend.agents.specialized import execute_coding_task, execute_teaching_task, execute_vision_task
from backend.agents.automation import execute_automation
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field

class AgentState(TypedDict):
    input: str
    intent: str
    response: str
    metadata: dict

# Define a simple intent classification schema
class IntentClassification(BaseModel):
    intent: Literal["coding", "teaching", "vision", "automation", "general"] = Field(
        description="The routed intent of the user's input."
    )

def router_node(state: AgentState) -> AgentState:
    """Classifies the intent to route to the correct agent."""
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are the JARVIS Router Agent. Classify the user's input into one of these categories: 'coding', 'teaching', 'vision', 'automation', or 'general'."),
        ("user", "{input}")
    ])
    
    llm = llm_service.get_llm("deepseek-r1:8b", temperature=0.1)
    
    # In a full implementation, we'd use .with_structured_output(IntentClassification)
    # Since Ollama might not perfectly support structured output without specific formatting,
    # we'll use a prompt-based approach for the router.
    routing_prompt = f"Categorize this into EXACTLY ONE word (coding, teaching, vision, automation, general): {state['input']}"
    raw_intent = llm.invoke(routing_prompt).strip().lower()
    
    # Fallback checking
    valid_intents = ["coding", "teaching", "vision", "automation", "general"]
    intent = next((i for i in valid_intents if i in raw_intent), "general")
    
    state["intent"] = intent
    return state

def coding_node(state: AgentState) -> AgentState:
    state["response"] = execute_coding_task(state["input"])
    return state

def teaching_node(state: AgentState) -> AgentState:
    state["response"] = execute_teaching_task(state["input"])
    return state

def vision_node(state: AgentState) -> AgentState:
    image_path = state.get("metadata", {}).get("image_path", "")
    if not image_path:
        state["response"] = "Error: Vision task requested but no image path provided."
    else:
        state["response"] = execute_vision_task(image_path, state["input"])
    return state

def automation_node(state: AgentState) -> AgentState:
    state["response"] = execute_automation(state["input"], llm_service)
    return state

def general_node(state: AgentState) -> AgentState:
    llm = llm_service.get_llm("deepseek-r1:8b")
    state["response"] = llm.invoke(state["input"])
    return state

def route_to_agent(state: AgentState) -> str:
    return state["intent"]

# Build the Graph
workflow = StateGraph(AgentState)

workflow.add_node("router", router_node)
workflow.add_node("coding", coding_node)
workflow.add_node("teaching", teaching_node)
workflow.add_node("vision", vision_node)
workflow.add_node("automation", automation_node)
workflow.add_node("general", general_node)

workflow.add_edge(START, "router")

workflow.add_conditional_edges(
    "router",
    route_to_agent,
    {
        "coding": "coding",
        "teaching": "teaching",
        "vision": "vision",
        "automation": "automation",
        "general": "general"
    }
)

workflow.add_edge("coding", END)
workflow.add_edge("teaching", END)
workflow.add_edge("vision", END)
workflow.add_edge("automation", END)
workflow.add_edge("general", END)

jarvis_graph = workflow.compile()
