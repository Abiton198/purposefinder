import React, { useState } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import { messages, demoUsers } from '@/data/mockData';
import { Send, Search, Plus, Inbox, ArrowLeft } from 'lucide-react';

const MessagesModule: React.FC = () => {
  const { currentUser } = useSchool();
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const [composeData, setComposeData] = useState({ to: '', subject: '', content: '' });
  const [replyText, setReplyText] = useState('');

  const userId = currentUser?.id || 'u4';
  const myMessages = messages.filter(m => m.senderId === userId || m.receiverId === userId);
  const filteredMessages = searchQuery
    ? myMessages.filter(m => m.subject.toLowerCase().includes(searchQuery.toLowerCase()) || m.senderName.toLowerCase().includes(searchQuery.toLowerCase()))
    : myMessages;

  const selected = selectedMessage ? messages.find(m => m.id === selectedMessage) : null;

  const handleSend = () => {
    if (composeData.subject && composeData.content) {
      setShowCompose(false);
      setComposeData({ to: '', subject: '', content: '' });
    }
  };

  const handleReply = () => {
    if (replyText) {
      setReplyText('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Messages</h2>
        <button onClick={() => setShowCompose(true)} className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> Compose
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 min-h-[500px]">
        {/* Message List */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search messages..." className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" />
            </div>
          </div>
          <div className="divide-y divide-gray-50 max-h-[500px] overflow-y-auto">
            {filteredMessages.map(msg => (
              <button
                key={msg.id}
                onClick={() => setSelectedMessage(msg.id)}
                className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${selectedMessage === msg.id ? 'bg-purple-50' : ''} ${!msg.read && msg.receiverId === userId ? 'border-l-2 border-l-purple-500' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="font-medium text-sm text-gray-900 truncate">{msg.senderId === userId ? `To: ${msg.receiverName}` : msg.senderName}</div>
                  <span className="text-[10px] text-gray-400 shrink-0 ml-2">{new Date(msg.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="text-sm text-gray-700 truncate mt-0.5">{msg.subject}</div>
                <div className="text-xs text-gray-400 truncate mt-1">{msg.content}</div>
              </button>
            ))}
            {filteredMessages.length === 0 && (
              <div className="p-8 text-center">
                <Inbox className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No messages found</p>
              </div>
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6">
          {selected ? (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900">{selected.subject}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <img src={demoUsers.find(u => u.id === selected.senderId)?.avatar || ''} alt="" className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{selected.senderName}</div>
                    <div className="text-xs text-gray-500">To: {selected.receiverName} &middot; {new Date(selected.createdAt).toLocaleString()}</div>
                  </div>
                </div>
              </div>
              <div className="prose prose-sm max-w-none text-gray-700 mb-6">
                <p>{selected.content}</p>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                    onKeyDown={(e) => e.key === 'Enter' && handleReply()}
                  />
                  <button onClick={handleReply} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <Inbox className="w-16 h-16 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500">Select a message to read</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCompose(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">New Message</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">To</label>
                <select value={composeData.to} onChange={(e) => setComposeData(p => ({ ...p, to: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-200">
                  <option value="">Select recipient...</option>
                  {demoUsers.filter(u => u.id !== userId).map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Subject</label>
                <input type="text" value={composeData.subject} onChange={(e) => setComposeData(p => ({ ...p, subject: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" placeholder="Message subject..." />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Message</label>
                <textarea value={composeData.content} onChange={(e) => setComposeData(p => ({ ...p, content: e.target.value }))} rows={5} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 resize-none" placeholder="Write your message..." />
              </div>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowCompose(false)} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
                <button onClick={handleSend} className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
                  <Send className="w-4 h-4" /> Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesModule;
