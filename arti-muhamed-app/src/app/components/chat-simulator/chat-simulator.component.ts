import { Component, OnInit } from '@angular/core';
import { ChatMessage } from '../../models/chat-message.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { Chatbot } from '../../models/chatbot.model';
import { LocalStorageService } from '../../services/local-storage.service';
import { StoredFile } from '../../models/stored-file.model';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-chat-simulator',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './chat-simulator.component.html',
  styleUrl: './chat-simulator.component.scss',
})
export class ChatSimulatorComponent implements OnInit {
  userInput = '';
  chatHistory: ChatMessage[] = [];
  chatbotConfig!: Chatbot;
  storedFiles: StoredFile[] = [];
  isTyping = false;

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.chatbotConfig = this.localStorageService.getChatbotConfig() || {
      name: 'Chatbot',
      personality: 0.5,
      description: '',
    };

    this.storedFiles = this.localStorageService.getFiles();
    this.chatHistory = this.localStorageService.getChatHistory();
  }

  sendMessage(): void {
    const trimmed = this.userInput.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = {
      sender: 'user',
      message: trimmed,
      created_timestamp: new Date(),
    };
    this.chatHistory.push(userMessage);
    this.localStorageService.saveChatHistory(this.chatHistory);
    this.userInput = '';
    this.isTyping = true;

    setTimeout(() => {
      const botMessage: ChatMessage = {
        sender: 'bot',
        message: this.generateFakeBotReply(trimmed),
        created_timestamp: new Date(),
      };
      this.chatHistory.push(botMessage);
      this.localStorageService.saveChatHistory(this.chatHistory);
      this.isTyping = false;
    }, 1400);
  }

  clearChat(): void {
    this.chatHistory = [];
    this.isTyping = false;
    this.localStorageService.clearChatHistory();
  }

  generateFakeBotReply(userMsg: string): string {
    const lower = userMsg.toLowerCase();
    if (lower.includes('hello') || lower.includes('hi'))
      return 'Hello! How can I help?';
    if (lower.includes('who are you')) return 'I am your friendly chatbot';
    if (lower.includes('bye')) return 'Goodbye! Have a great day!';
    return 'Hmm... interesting! Tell me more.';
  }
}
