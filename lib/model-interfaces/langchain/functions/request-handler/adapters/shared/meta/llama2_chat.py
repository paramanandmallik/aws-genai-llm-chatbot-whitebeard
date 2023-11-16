import json

from langchain.schema import AIMessage, HumanMessage
from langchain.memory import ConversationBufferMemory
from langchain.prompts import PromptTemplate


class Llama2ConversationBufferMemory(ConversationBufferMemory):
    @property
    def buffer_as_str(self) -> str:
        return self.get_buffer_string()

    def get_buffer_string(self) -> str:
        """modified version of https://github.com/langchain-ai/langchain/blob/bed06a4f4ab802bedb3533021da920c05a736810/libs/langchain/langchain/schema/messages.py#L14"""
        human_message_cnt = 0
        string_messages = []
        for m in self.chat_memory.messages:
            if isinstance(m, HumanMessage):
                if human_message_cnt == 0:
                    message = f"{m.content} [/INST]"
                else:
                    message = f"<s> [INST] {m.content} [/INST]"
                human_message_cnt += 1
            elif isinstance(m, AIMessage):
                message = f"{m.content} </s>"
            else:
                raise ValueError(f"Got unsupported message type: {m}")
            string_messages.append(message)


Llama2ChatPrompt = """<<SYS>>\nYou are an helpful assistant that provides concise answers to user questions with as little sentences as possible and at maximum 3 sentences. You do not repeat yourself. You avoid bulleted list or emojis.
<<SYS>>

{chat_history} <s> [INST] {input}"""

Llama2ChatPromptTemplate = PromptTemplate.from_template(Llama2ChatPrompt)
