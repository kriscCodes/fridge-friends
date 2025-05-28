import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ChatSection({ barterId, currentUser }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        if (!barterId) return;

        // Subscribe to new messages
        const subscription = supabase
            .channel(`barter_messages:${barterId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'barter_messages',
                    filter: `barter_id=eq.${barterId}`,
                },
                (payload) => {
                    setMessages((current) => {
                        // Check for duplicate by created_at and content
                        if (
                            current.some(
                                (msg) =>
                                    msg.created_at === payload.new.created_at &&
                                    msg.content === payload.new.content
                            )
                        ) {
                            return current;
                        }
                        return [...current, payload.new];
                    });
                }
            )
            .subscribe();

        // Fetch existing messages
        const fetchMessages = async () => {
            const { data: messagesData, error: messagesError } = await supabase
                .from('barter_messages')
                .select('*')
                .eq('barter_id', barterId)
                .order('created_at', { ascending: true });

            if (messagesError) {
                console.error('Error fetching messages:', messagesError);
                return;
            }

            setMessages(messagesData);
        };

        fetchMessages();

        return () => {
            subscription.unsubscribe();
        };
    }, [barterId]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !barterId || !currentUser) return;

        try {
            const { error } = await supabase.from('barter_messages').insert({
                barter_id: barterId,
                sender_id: currentUser.id,
                content: newMessage.trim(),
            });

            if (error) throw error;
            setNewMessage('');
        } catch (err) {
            console.error('Error sending message:', err);
        }
    };

    if (!barterId) {
        return (
            <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col h-[600px] items-center justify-center">
                <p className="text-gray-500 text-center">
                    Select a barter to view messages
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col h-[600px]">
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${
                            message.sender_id === currentUser?.id
                                ? 'justify-end'
                                : 'justify-start'
                        }`}
                    >
                        <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                                message.sender_id === currentUser?.id
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-800'
                            }`}
                        >
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs mt-1 opacity-70">
                                {new Date(message.created_at).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1"
                />
                <Button type="submit">Send</Button>
            </form>
        </div>
    );
} 