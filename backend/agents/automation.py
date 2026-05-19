import pyautogui
from langchain_core.tools import tool
import logging

logger = logging.getLogger(__name__)

# Configure PyAutoGUI safety settings
pyautogui.FAILSAFE = True
pyautogui.PAUSE = 0.5

@tool
def move_mouse(x: int, y: int) -> str:
    """Moves the mouse to the absolute x and y coordinates on the screen."""
    try:
        pyautogui.moveTo(x, y, duration=0.5)
        return f"Mouse moved to ({x}, {y})"
    except Exception as e:
        return f"Error moving mouse: {str(e)}"

@tool
def click_mouse(button: str = "left") -> str:
    """Clicks the mouse button (left, right, or middle)."""
    try:
        pyautogui.click(button=button)
        return f"Mouse clicked ({button})"
    except Exception as e:
        return f"Error clicking mouse: {str(e)}"

@tool
def type_text(text: str) -> str:
    """Types the given text using the keyboard."""
    try:
        pyautogui.write(text, interval=0.05)
        return f"Typed: {text}"
    except Exception as e:
        return f"Error typing text: {str(e)}"

@tool
def press_key(key: str) -> str:
    """Presses a specific keyboard key (e.g., 'enter', 'win', 'esc')."""
    try:
        pyautogui.press(key)
        return f"Pressed key: {key}"
    except Exception as e:
        return f"Error pressing key: {str(e)}"

@tool
def take_screenshot(filepath: str = "screenshot.png") -> str:
    """Takes a full screen screenshot and saves it to the given filepath."""
    try:
        screenshot = pyautogui.screenshot()
        screenshot.save(filepath)
        return f"Screenshot saved to {filepath}"
    except Exception as e:
        return f"Error taking screenshot: {str(e)}"

AUTOMATION_TOOLS = [move_mouse, click_mouse, type_text, press_key, take_screenshot]

def execute_automation(intent: str, llm_service) -> str:
    """
    Basic executor for automation tools.
    In a full LangGraph, this node would be an agent executor binding these tools.
    """
    # For now, we return a mocked execution path or bind tools to the LLM.
    llm = llm_service.get_llm("deepseek-r1:8b")
    # Bind tools (assuming the Ollama implementation supports tool binding, or we use a custom prompt)
    return "Automation tool execution initiated."
