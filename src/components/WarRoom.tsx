import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, Users, Shield, Zap, Terminal, Activity, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  db, 
  auth, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  serverTimestamp,
  signInWithPopup,
  googleProvider,
  handleFirestoreError,
  OperationType,
  doc,
  getDoc,
  setDoc
} from '@/src/firebase';

interface Message {
  id: string;
  user: string;
  content: string;
  time: string;
  role: 'admin' | 'user' | 'system';
  userId: string;
}

export const WarRoom: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [user, setUser] = useState(auth.currentUser);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);
      setIsAuthReady(true);

      if (firebaseUser) {
        // Sync user profile to Firestore
        const userRef = doc(db, 'users', firebaseUser.uid);
        try {
          const userDoc = await getDoc(userRef);
          if (!userDoc.exists()) {
            await setDoc(userRef, {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName || 'Anonymous',
              email: firebaseUser.email || '',
              photoURL: firebaseUser.photoURL || '',
              role: firebaseUser.email === 'vidhyasagar.bm@gmail.com' ? 'admin' : 'user',
              lastSeen: serverTimestamp()
            });
          } else {
            await setDoc(userRef, { lastSeen: serverTimestamp() }, { merge: true });
          }
        } catch (error) {
          console.error("Error syncing user profile:", error);
        }
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) {
      setMessages([]);
      return;
    }

    const q = query(
      collection(db, 'messages'),
      orderBy('createdAt', 'asc'),
      limit(50)
    );

    const unsubscribeMessages = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          user: data.userName,
          content: data.content,
          time: data.createdAt?.toDate ? data.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...',
          role: data.role,
          userId: data.userId
        } as Message;
      });
      setMessages(msgs);
    }, (error) => {
      // Only log if it's not a permission error during sign out
      if (auth.currentUser) {
        handleFirestoreError(error, OperationType.LIST, 'messages');
      }
    });

    return () => unsubscribeMessages();
  }, [user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !user) return;
    
    const messageData = {
      content: input,
      userId: user.uid,
      userName: user.displayName || 'Anonymous',
      userPhoto: user.photoURL || '',
      role: user.email === 'vidhyasagar.bm@gmail.com' ? 'admin' : 'user',
      createdAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db, 'messages'), messageData);
      setInput('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'messages');
    }
  };

  return (
    <div className="h-full flex overflow-hidden bg-black/20">
      {/* Left: Chat Area */}
      <div className="flex-1 flex flex-col border-r border-terminal-border">
        <div className="h-16 border-b border-terminal-border flex items-center justify-between px-8 bg-black/40">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-terminal-green" />
            <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-terminal-text">Secure War Room</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-terminal-green animate-pulse" />
              <span className="text-[10px] font-mono text-terminal-text/40 uppercase tracking-widest">Live Session</span>
            </div>
            <Separator orientation="vertical" className="h-4 bg-terminal-border" />
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-terminal-text/40" />
              <span className="text-[10px] font-mono text-terminal-text/40 uppercase tracking-widest">{messages.length > 0 ? 'Active' : 'Idle'}</span>
            </div>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar"
        >
          {!isAuthReady ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="w-8 h-8 text-terminal-green" />
              </motion.div>
              <p className="text-[10px] font-mono text-terminal-text/40 uppercase tracking-widest">Establishing Secure Connection...</p>
            </div>
          ) : !user ? (
            <div className="h-full flex flex-col items-center justify-center space-y-6 text-center">
              <div className="w-16 h-16 rounded-full bg-terminal-green/5 border border-terminal-green/20 flex items-center justify-center">
                <Shield className="w-8 h-8 text-terminal-green/40" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-terminal-text uppercase tracking-tight">Access Restricted</h3>
                <p className="text-xs text-terminal-text/40 font-mono max-w-xs mx-auto">
                  The War Room is a restricted communication channel. Please authenticate with your operative credentials to gain access.
                </p>
              </div>
              <Button 
                onClick={handleLogin}
                className="bg-terminal-green text-black hover:bg-terminal-green/90 font-mono font-bold text-[10px] px-12 h-12"
              >
                <LogIn className="w-4 h-4 mr-2" />
                AUTHENTICATE VIA GOOGLE
              </Button>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-20">
              <Terminal className="w-12 h-12 mb-4" />
              <p className="text-[10px] font-mono uppercase tracking-widest">No messages in current session</p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex flex-col max-w-[80%]",
                    msg.userId === user?.uid ? "ml-auto items-end" : "items-start"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={cn(
                      "text-[10px] font-mono font-bold uppercase tracking-widest",
                      msg.role === 'admin' ? "text-red-400" : msg.role === 'system' ? "text-terminal-cyan" : "text-terminal-green"
                    )}>
                      {msg.user}
                    </span>
                    <span className="text-[9px] font-mono text-terminal-text/20">{msg.time}</span>
                  </div>
                  <div className={cn(
                    "px-4 py-2.5 rounded-2xl text-xs font-mono leading-relaxed",
                    msg.userId === user?.uid 
                      ? "bg-terminal-green text-black rounded-tr-none" 
                      : msg.role === 'system'
                        ? "bg-terminal-cyan/10 border border-terminal-cyan/20 text-terminal-cyan rounded-tl-none italic"
                        : "bg-white/5 border border-white/10 text-terminal-text/80 rounded-tl-none"
                  )}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        <div className="p-6 border-t border-terminal-border bg-black/40">
          {!user ? (
            <div className="h-12 flex items-center justify-center">
              <span className="text-[9px] font-mono text-terminal-text/20 uppercase tracking-widest italic">Awaiting Operative Authentication...</span>
            </div>
          ) : (
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message to the team..."
                className="w-full bg-black/40 border border-terminal-border rounded-xl px-4 py-3 text-xs font-mono focus:outline-none focus:border-terminal-green/50 pr-12"
              />
              <Button
                onClick={handleSend}
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-terminal-green text-black hover:bg-terminal-green/90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Right: Sidebar Info */}
      <div className="w-80 flex flex-col bg-black/30">
        <div className="p-6 border-b border-terminal-border">
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-terminal-text/60 mb-4">Active Operations</h3>
          <div className="space-y-4">
            {[
              { name: 'Operation: Blackout', status: 'In Progress', icon: Zap, color: 'text-orange-400' },
              { name: 'Global Recon Scan', status: 'Active', icon: Activity, color: 'text-terminal-green' },
              { name: 'Firewall Breach', status: 'Mitigated', icon: Shield, color: 'text-terminal-cyan' },
            ].map((op, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                <op.icon className={cn("w-4 h-4", op.color)} />
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono font-bold text-terminal-text/80">{op.name}</span>
                  <span className="text-[9px] font-mono text-terminal-text/30 uppercase">{op.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-terminal-text/60 mb-4">Online Agents</h3>
          <div className="space-y-3">
            {['Ghost_Protocol', 'Root_Admin', 'Cyber_Ninja', 'Shadow_Walker', 'Byte_Master', 'Zero_Day'].map((agent, i) => (
              <div key={i} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-terminal-green" />
                  <span className="text-[11px] font-mono text-terminal-text/60 group-hover:text-terminal-text transition-colors">{agent}</span>
                </div>
                <Terminal className="w-3 h-3 text-terminal-text/20 group-hover:text-terminal-green transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

function Separator({ orientation = 'horizontal', className }: { orientation?: 'horizontal' | 'vertical', className?: string }) {
  return (
    <div className={cn(
      "bg-terminal-border",
      orientation === 'horizontal' ? "h-[1px] w-full" : "w-[1px] h-full",
      className
    )} />
  );
}
