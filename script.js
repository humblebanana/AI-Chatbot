// 配置参数
const config = {
    apiUrl: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
    apiKey: 'f807df94dcf1dd1b864e14c44341eb2d.CD3tfXmAOenOmBTq',
    model: 'glm-4'
};

const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const message = userInput.value.trim();
    if (message) {
        appendMessage('用户', message);
        userInput.value = '';
        fetchAIResponse(message);
    }
}

function appendMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.className = sender === '用户' ? 'flex justify-end items-start space-x-2' : 'flex justify-start items-start space-x-2';
    
    const iconElement = document.createElement('div');
    iconElement.className = 'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center';
    if (sender === '用户') {
        iconElement.className += ' bg-blue-600 text-white';
        iconElement.innerHTML = '<i class="fas fa-user"></i>';
    } else {
        iconElement.className += ' bg-gray-200 text-gray-600';
        iconElement.innerHTML = '<i class="fas fa-robot"></i>';
    }
    
    const textElement = document.createElement('div');
    textElement.className = `max-w-xs ${sender === '用户' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'} rounded-lg px-4 py-2`;
    textElement.textContent = message;
    
    if (sender === '用户') {
        messageElement.appendChild(textElement);
        messageElement.appendChild(iconElement);
    } else {
        messageElement.appendChild(iconElement);
        messageElement.appendChild(textElement);
    }
    
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function fetchAIResponse(message) {
    try {
        const response = await fetch(config.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.apiKey}`
            },
            body: JSON.stringify({
                model: config.model,
                messages: [
                    {
                        role: "user",
                        content: message
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API请求失败: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        if (data.choices && data.choices[0] && data.choices[0].message) {
            const aiMessage = data.choices[0].message.content;
            appendMessage('AI', aiMessage);
        } else {
            throw new Error('API响应格式不正确');
        }
    } catch (error) {
        console.error('错误:', error);
        appendMessage('系统', `抱歉,发生了错误: ${error.message}`);
    }
}
