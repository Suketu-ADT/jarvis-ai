from backend.agents.llm import llm_service
from langchain_core.prompts import ChatPromptTemplate

def execute_coding_task(task: str) -> str:
    """Executes a coding task using the deepseek-coder-v2 model."""
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are JARVIS's specialized Coding Agent. Write clean, efficient, and well-documented code. Only output code or explanations when requested."),
        ("user", "{task}")
    ])
    
    llm = llm_service.get_llm("deepseek-coder-v2")
    chain = prompt | llm
    return chain.invoke({"task": task})

def execute_teaching_task(topic: str) -> str:
    """Executes a teaching/explanation task using deepseek-r1:8b."""
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are JARVIS's specialized Teaching Agent. Explain concepts clearly, like a tutor. Break down complex topics into digestible pieces."),
        ("user", "Explain the following topic: {topic}")
    ])
    
    llm = llm_service.get_llm("deepseek-r1:8b")
    chain = prompt | llm
    return chain.invoke({"topic": topic})

def execute_vision_task(image_path: str, prompt: str) -> str:
    """Executes a vision task using llava. (Note: Ollama image support via Langchain might require specific base64 encoding)."""
    import base64
    try:
        with open(image_path, "rb") as img_file:
            img_b64 = base64.b64encode(img_file.read()).decode("utf-8")
    except Exception as e:
        return f"Error loading image: {str(e)}"
        
    # Ollama vision models expect images in a specific format.
    # We use the generic llm but we must pass the image.
    llm = llm_service.get_llm("llava")
    
    # Simple binding for Ollama vision - actual implementation varies by LangChain version
    try:
        from langchain_core.messages import HumanMessage
        message = HumanMessage(
            content=[
                {"type": "text", "text": prompt},
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{img_b64}"}}
            ]
        )
        response = llm.invoke([message])
        return response
    except Exception as e:
        return f"Vision Error: {str(e)}"
