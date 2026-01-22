export type ChatRole = 'guest' | 'admin' | 'player' | 'judge' | 'coach' | 'organizer';

export interface ChatTurn {
  id?: string;
  message: string;
  reply: string;
  createdAt?: string;
}

export interface ChatReply {
  success: boolean;
  data?: { reply: string };
  message?: string;
}