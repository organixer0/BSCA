import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Home, Trophy, Shield, Crosshair, Settings, Heart, MessageCircle,
  Users, Swords, Flame, Clock, Video, Plus, X, Send, Lock, Mail, 
  Key, LogOut, Trash2, Upload, Pin, FileText, CheckCircle
} from 'lucide-react';

// --- SUPABASE CONFIGURATION ---
// In Netlify, these will be read from your Environment Variables
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || 'placeholder_key';
const supabase = createClient(supabaseUrl, supabaseKey);

// --- APP CONFIG ---
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'fvckoffmypage';
const geometricPattern = `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 20L20 40L0 20L20 0ZM20 4L4 20L20 36L36 20L20 4Z' fill='%23ef4444' fill-opacity='0.02' fill-rule='evenodd'/%3E%3C/svg%3E")`;

// --- CUSTOM COMPONENTS ---
// Logo placeholder component - replace the src with your actual file
const Logo = ({ className = "w-12 h-12" }) => (
  <div className={`relative flex items-center justify-center overflow-hidden rounded-lg bg-stone-900 border border-red-900/50 ${className}`}>
    {/* Replace this img src with your actual /assets/logo.png */}
    <img 
      src="/assets/logo.png" 
      alt="BSCA" 
      className="w-full h-full object-contain z-10"
      onError={(e) => {
        // Fallback placeholder if image is missing
        e.target.style.display = 'none';
        e.target.nextSibling.style.display = 'flex';
      }}
    />
    {/* Fallback UI if logo.png is not found */}
    <div className="absolute inset-0 hidden items-center justify-center bg-stone-950 font-black text-red-600 text-xs text-center leading-none italic">
      LOGO<br/>PNG
    </div>
  </div>
);

// --- MAIN APP COMPONENT ---
export default function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');

  // Check auth session on load
  useEffect(() => {
    const checkSession = async () => {
      // Mock session check for prototype environments without supabase keys
      if (supabaseUrl === 'https://placeholder.supabase.co') {
        setTimeout(() => setLoading(false), 1000);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      }
      setLoading(false);
    };
    checkSession();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) setUser(session.user);
      else setUser(null);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    setIsAdmin(false);
    setUser(null);
    await supabase.auth.signOut();
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center" style={{ backgroundImage: geometricPattern }}>
        <div className="w-16 h-16 border-4 border-red-900 border-t-red-500 rounded-full animate-spin mb-4"></div>
        <p className="text-red-500 font-bold tracking-widest uppercase text-sm animate-pulse">Initializing System...</p>
      </div>
    );
  }

  // 2. Authentication Screen
  if (!user && !isAdmin) {
    return <AuthScreen setUser={setUser} setIsAdmin={setIsAdmin} setActiveTab={setActiveTab} />;
  }

  // 3. Main Interface
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-red-600 overflow-hidden flex justify-center" style={{ backgroundImage: geometricPattern }}>
      <div className="w-full max-w-md bg-stone-900/95 backdrop-blur-md h-[100dvh] flex flex-col relative shadow-2xl shadow-black/50 border-x border-stone-800">
        
        {/* HEADER */}
        <header className="flex items-center justify-between p-4 bg-stone-950 border-b border-red-900/30 z-10 shrink-0">
          <div className="flex items-center gap-3">
            <Logo className="w-10 h-10 shadow-lg shadow-red-900/20" />
            <div>
              <h1 className="text-lg font-black tracking-wider text-white uppercase leading-none">
                Bloodstrike
              </h1>
              <p className="text-[9px] text-red-500 font-bold uppercase tracking-[0.15em] mt-0.5">
                Community of Africa
              </p>
            </div>
          </div>
          <button onClick={handleLogout} className="p-2 rounded-lg bg-stone-800/50 text-stone-400 hover:text-red-500 hover:bg-stone-800 transition-colors border border-stone-700">
            <LogOut size={18} />
          </button>
        </header>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto pb-24 custom-scrollbar relative">
          {isAdmin && activeTab === 'admin' && <AdminPanel />}
          {activeTab === 'home' && <HomeTab user={user} isAdmin={isAdmin} />}
          {activeTab === 'tournaments' && <TournamentsTab />}
          {activeTab === 'clans' && <ClansTab />}
          {activeTab === 'armory' && <ArmoryTab />}
        </main>

        {/* BOTTOM NAVIGATION */}
        <nav className="absolute bottom-0 w-full bg-stone-950 border-t border-red-900/30 pb-safe pt-2 px-2 rounded-t-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.8)] z-20 shrink-0">
          <div className="flex justify-between items-center pb-3 pt-1 relative">
            <NavItem icon={<Home />} label="Feed" isActive={activeTab === 'home'} onClick={() => setActiveTab('home')} />
            <NavItem icon={<Trophy />} label="Events" isActive={activeTab === 'tournaments'} onClick={() => setActiveTab('tournaments')} />
            
            {/* Center Action Button */}
            <div className="-mt-8 relative group z-30">
               <div className="absolute inset-0 bg-red-600 rounded-full blur-md opacity-50 group-hover:opacity-100 transition-opacity"></div>
               <button 
                  onClick={() => setActiveTab(isAdmin ? 'admin' : 'home')}
                  className={`relative w-14 h-14 rounded-full flex items-center justify-center border-4 border-stone-950 text-white transform hover:scale-105 transition-transform ${isAdmin ? 'bg-gradient-to-tr from-purple-700 to-red-500' : 'bg-gradient-to-tr from-red-700 to-red-500'}`}
                >
                 {isAdmin ? <Shield size={26} strokeWidth={2.5} /> : <Swords size={26} strokeWidth={2.5} />}
               </button>
               {isAdmin && <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-red-500 bg-stone-950 px-2 py-0.5 rounded border border-red-900">ADMIN</span>}
            </div>
            
            <NavItem icon={<Users />} label="Clans" isActive={activeTab === 'clans'} onClick={() => setActiveTab('clans')} />
            <NavItem icon={<Crosshair />} label="Armory" isActive={activeTab === 'armory'} onClick={() => setActiveTab('armory')} />
          </div>
        </nav>
      </div>
    </div>
  );
}

// --- AUTH SCREEN ---
function AuthScreen({ setUser, setIsAdmin, setActiveTab }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsProcessing(true);

    // 1. Check for Admin Backdoor credentials
    if (email === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setUser({ id: 'admin-override', email: 'admin' });
      setActiveTab('admin');
      setIsProcessing(false);
      return;
    }

    // 2. Normal User Supabase Auth
    try {
      if (supabaseUrl === 'https://placeholder.supabase.co') {
        // Mock auth success for preview environment
        setTimeout(() => {
          setUser({ id: 'mock-user-123', email });
          setIsProcessing(false);
        }, 800);
        return;
      }

      let result;
      if (isLogin) {
        result = await supabase.auth.signInWithPassword({ email, password });
      } else {
        result = await supabase.auth.signUp({ email, password });
      }

      if (result.error) throw result.error;
      if (result.data.user) setUser(result.data.user);

    } catch (err) {
      setError(err.message || 'Authentication failed. Check credentials.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center p-4 relative" style={{ backgroundImage: geometricPattern }}>
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950 pointer-events-none" />
      
      <div className="w-full max-w-sm bg-stone-900/80 backdrop-blur-xl border border-red-900/50 rounded-3xl p-8 relative z-10 shadow-[0_0_50px_rgba(220,38,38,0.15)]">
        <div className="flex flex-col items-center mb-8">
          <Logo className="w-20 h-20 mb-4 shadow-[0_0_30px_rgba(220,38,38,0.3)]" />
          <h2 className="text-2xl font-black text-white tracking-widest uppercase italic text-center">BSCA Hub</h2>
          <p className="text-xs text-red-500 font-bold uppercase tracking-[0.2em] text-center mt-1">Access Terminal</p>
        </div>

        {error && (
          <div className="bg-red-950/50 border border-red-900 text-red-400 text-xs p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" size={18} />
            <input 
              type="text" 
              placeholder="Email or Username" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all placeholder-stone-600"
              required
            />
          </div>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" size={18} />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all placeholder-stone-600"
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isProcessing}
            className="w-full py-3.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-black uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all active:scale-95"
          >
            {isProcessing ? 'Authenticating...' : isLogin ? 'Initialize Uplink' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs text-stone-500 hover:text-red-400 font-bold uppercase tracking-wider transition-colors"
          >
            {isLogin ? "Need access? Register here" : "Already registered? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- ADMIN PANEL COMPONENT ---
function AdminPanel() {
  const [activeAdminSection, setActiveAdminSection] = useState('feed');

  return (
    <div className="p-4 animate-fade-in h-full flex flex-col">
      <div className="mb-4 pb-4 border-b border-stone-800 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-500 uppercase italic">Admin Terminal</h2>
          <p className="text-xs text-stone-400 uppercase tracking-widest font-bold">System Override Active</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar shrink-0">
        {['feed', 'tournaments', 'clans', 'armory'].map(section => (
          <button 
            key={section}
            onClick={() => setActiveAdminSection(section)}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
              activeAdminSection === section 
                ? 'bg-red-600 text-white shadow-lg shadow-red-900/30' 
                : 'bg-stone-900 text-stone-400 border border-stone-800 hover:bg-stone-800'
            }`}
          >
            Manage {section}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeAdminSection === 'feed' && <AdminFeedModeration />}
        {activeAdminSection === 'tournaments' && <AdminTournaments />}
        {activeAdminSection === 'clans' && <AdminClans />}
        {activeAdminSection === 'armory' && <AdminArmory />}
      </div>
    </div>
  );
}

// Admin Sub-views (Mocks interacting with Supabase tables)
function AdminFeedModeration() {
  const [content, setContent] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [mediaFile, setMediaFile] = useState(null);

  const handlePostNews = async () => {
    // Supabase logic for posting Admin news with media
    if (!content.trim()) return;
    alert("Admin News Posted to Supabase DB!");
    setContent('');
    setMediaFile(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Plus size={16} className="text-red-500" /> Announce News</h3>
        <textarea 
          placeholder="System wide announcement..." 
          value={content} onChange={e => setContent(e.target.value)}
          className="w-full bg-stone-950 border border-stone-800 rounded p-3 text-sm text-white h-24 resize-none mb-3"
        />
        <div className="flex items-center justify-between mb-4">
          <label className="flex items-center gap-2 text-sm text-stone-400 cursor-pointer">
            <input type="checkbox" checked={isPinned} onChange={e => setIsPinned(e.target.checked)} className="accent-red-600" />
            <Pin size={14} className={isPinned ? "text-red-500" : ""} /> Pin to Top
          </label>
          <label className="flex items-center gap-2 text-sm text-stone-400 cursor-pointer hover:text-white transition-colors bg-stone-950 px-3 py-1.5 rounded border border-stone-800">
            <Upload size={14} /> {mediaFile ? 'Media Attached' : 'Attach Media'}
            <input type="file" accept="image/*,video/*" className="hidden" onChange={e => setMediaFile(e.target.files[0])} />
          </label>
        </div>
        <button onClick={handlePostNews} className="w-full bg-red-600 text-white font-bold py-2.5 rounded-lg shadow-lg">Broadcast</button>
      </div>

      <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Trash2 size={16} className="text-red-500" /> Moderation Queue</h3>
        <p className="text-xs text-stone-500 italic mb-4">In a live environment, recent posts populate here with delete buttons.</p>
        <div className="p-3 bg-stone-950 border border-stone-800 rounded flex justify-between items-center group">
          <div>
            <span className="text-xs font-bold text-white">Spammer123</span>
            <p className="text-xs text-stone-500 truncate w-48">Buy cheap skins here http://...</p>
          </div>
          <button className="text-red-500 bg-red-950 p-2 rounded hover:bg-red-600 hover:text-white transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminTournaments() {
  const [title, setTitle] = useState('');
  return (
    <div className="space-y-4">
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
        <h3 className="font-bold text-white mb-4">Add Tournament</h3>
        <input placeholder="Tournament Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-sm text-white mb-2" />
        <div className="grid grid-cols-2 gap-2 mb-3">
          <input placeholder="Type (e.g. Squads)" className="bg-stone-950 border border-stone-800 rounded p-2 text-sm text-white" />
          <input placeholder="Date & Time" className="bg-stone-950 border border-stone-800 rounded p-2 text-sm text-white" />
        </div>
        <button onClick={() => alert("Added to DB")} className="w-full bg-red-600 text-white font-bold py-2 rounded-lg">Create Event</button>
      </div>
    </div>
  );
}

function AdminClans() {
  return (
    <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
      <h3 className="font-bold text-white mb-4">Edit Top Clans</h3>
      <p className="text-xs text-stone-500 mb-4">Update the official leaderboards manually.</p>
      <div className="grid grid-cols-2 gap-2 mb-3">
         <input placeholder="Clan Name" className="bg-stone-950 border border-stone-800 rounded p-2 text-sm text-white" />
         <input placeholder="Rating" type="number" className="bg-stone-950 border border-stone-800 rounded p-2 text-sm text-white" />
      </div>
      <button onClick={() => alert("Updated Clans DB")} className="w-full bg-red-600 text-white font-bold py-2 rounded-lg">Update Leaderboard</button>
    </div>
  );
}

function AdminArmory() {
  return (
    <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
      <h3 className="font-bold text-white mb-4">Add Meta Loadout</h3>
      <p className="text-xs text-stone-500 mb-4">Post official recommended builds for players.</p>
      <input placeholder="Weapon (e.g. KAG-6)" className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-sm text-white mb-2" />
      <textarea placeholder="Attachments (comma separated)" className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-sm text-white mb-3 h-20" />
      <button onClick={() => alert("Added Loadout to DB")} className="w-full bg-red-600 text-white font-bold py-2 rounded-lg">Publish Loadout</button>
    </div>
  );
}


// --- HOME TAB (LIVE FEED) ---
function HomeTab({ user, isAdmin }) {
  const [posts, setPosts] = useState(getMockPosts());
  const [newPost, setNewPost] = useState("");
  const [showPostForm, setShowPostForm] = useState(false);

  // In production, fetch posts via Supabase realtime channels here
  
  const handlePost = () => {
    if (!newPost.trim()) return;
    const post = {
      id: Date.now().toString(),
      user: isAdmin ? 'BSCA_Admin' : `Striker_${user?.id?.substring(0, 4) || 'Anon'}`,
      isOfficial: isAdmin,
      tag: isAdmin ? "Announcement" : "Discussion",
      tagColor: isAdmin ? "text-red-500 border-red-500/30 bg-red-500/10" : "text-stone-400 border-stone-400/30 bg-stone-400/10",
      content: newPost.trim(),
      likes: 0, comments: 0, createdAt: Date.now()
    };
    setPosts([post, ...posts]);
    setNewPost("");
    setShowPostForm(false);
  };

  const handleDelete = (id) => {
    setPosts(posts.filter(p => p.id !== id));
  };

  return (
    <div className="p-4 space-y-6 animate-fade-in relative h-full">
      
      {/* Create Post FAB */}
      <button 
        onClick={() => setShowPostForm(true)}
        className="absolute bottom-6 right-4 w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-900/50 text-white z-10 hover:scale-105 transition-transform"
      >
        <Plus size={24} strokeWidth={3} />
      </button>

      {/* Post Form Modal */}
      {showPostForm && (
        <div className="absolute inset-0 bg-stone-950/90 z-20 p-4 flex flex-col animate-fade-in backdrop-blur-md">
          <div className="flex justify-between items-center mb-4 pt-2">
            <h3 className="text-lg font-bold text-white">Create Comm-Link</h3>
            <button onClick={() => setShowPostForm(false)} className="text-stone-400 hover:text-white"><X size={24}/></button>
          </div>
          <textarea 
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share strategies, look for groups, or drop highlights..."
            className="w-full bg-stone-900 border border-stone-700 rounded-xl p-4 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-red-500 h-32 resize-none mb-4"
          />
          <button 
            onClick={handlePost}
            disabled={!newPost.trim()}
            className="w-full py-3 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Send size={18} /> Transmit Message
          </button>
        </div>
      )}

      {/* Pinned News (Admin Posted) */}
      <div className="relative rounded-2xl overflow-hidden bg-stone-900 border border-red-900/50 shadow-[0_0_15px_rgba(220,38,38,0.15)]">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-stone-900 pointer-events-none" />
        <div className="p-4 relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Pin className="text-red-500" size={16} />
            <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Pinned News</span>
          </div>
          <h2 className="text-xl font-black text-white mb-1 uppercase italic tracking-wide">Season 5 Regional Qualifiers</h2>
          <p className="text-sm text-stone-300 font-medium">
            Registration opens this weekend. Make sure your clans are fully stacked.
          </p>
        </div>
      </div>

      {/* Community Feed */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest">Live Feed</h3>
          <span className="text-[10px] text-green-400 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> DB Sync Active</span>
        </div>
        
        <div className="space-y-4 pb-8">
          {posts.map(post => (
            <div key={post.id} className="bg-stone-900/80 border border-stone-800/80 rounded-xl p-4 shadow-sm relative group">
              {isAdmin && (
                <button onClick={() => handleDelete(post.id)} className="absolute top-4 right-4 text-stone-600 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              )}
              <div className="flex justify-between items-start mb-3 pr-6">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg ${getAvatarColor(post.user)} flex items-center justify-center font-black text-white shadow-inner text-sm`}>
                    {post.user.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-100 text-sm flex items-center gap-1">
                      {post.user}
                      {post.isOfficial && <Shield size={14} className="text-red-500" fill="currentColor" />}
                    </h4>
                    <p className="text-[10px] text-stone-500">
                      {new Date(post.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                </div>
              </div>
              
              <span className={`inline-block mb-3 text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${post.tagColor}`}>
                {post.tag}
              </span>
              
              <p className="text-sm text-stone-300 mb-3 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>

              {post.hasVideo && (
                <div className="w-full h-32 bg-stone-950 rounded-lg border border-stone-800 mb-4 flex items-center justify-center relative overflow-hidden group cursor-pointer">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40" />
                  <div className="w-10 h-10 bg-red-600/90 rounded-full flex items-center justify-center z-10 pl-1 shadow-lg backdrop-blur-sm">
                    <Video size={18} className="text-white" />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-6 text-stone-500 border-t border-stone-800/50 pt-3">
                <button className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
                  <Heart size={16} /> <span className="text-xs font-medium">{post.likes}</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-stone-300 transition-colors">
                  <MessageCircle size={16} /> <span className="text-xs font-medium">{post.comments}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- TOURNEYS TAB (Read Only for Users) ---
function TournamentsTab() {
  const events = [
    { title: "Weekend Warfare Scrims", type: "Squads", status: "Registration Open", teams: "24/32 Teams", date: "Saturday 18:00 UTC", live: false },
    { title: "Solo King of the Valley", type: "Solos", status: "Live Now", teams: "100 Players", date: "Ongoing", live: true }
  ];

  return (
    <div className="p-4 animate-fade-in h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-white uppercase italic">Tournaments</h2>
        <p className="text-sm text-stone-400">Official African server events.</p>
      </div>
      <div className="space-y-4">
        {events.map((evt, idx) => (
          <div key={idx} className={`bg-stone-900 border ${evt.live ? 'border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.1)]' : 'border-stone-800'} rounded-xl p-4 relative overflow-hidden`}>
            {evt.live && (
              <div className="absolute top-0 right-0 bg-red-600 text-white text-[9px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span> Live
              </div>
            )}
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider bg-stone-950 px-2 py-1 rounded-md border border-stone-800 mb-2 inline-block">{evt.type}</span>
            <h3 className="text-lg font-bold text-white mb-1">{evt.title}</h3>
            <div className="flex items-center gap-2 text-xs text-stone-400 font-medium mb-4">
              <Clock size={12} className={evt.live ? "text-red-400" : ""} /> {evt.date}
            </div>
            <div className="flex items-center justify-between border-t border-stone-800/60 pt-3">
              <div className="flex items-center gap-1.5 text-xs">
                <Users size={14} className="text-stone-500" />
                <span className="font-bold text-stone-300">{evt.teams}</span>
              </div>
              <button className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${evt.live ? 'bg-red-600/20 text-red-400 border border-red-600/30' : 'bg-stone-100 text-stone-900'}`}>
                {evt.live ? 'Watch Stream' : 'Register'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- CLANS TAB (Read Only for Users) ---
function ClansTab() {
  const clans = [
    { rank: 1, name: "Limitless Esports", tag: "[LMT]", members: 48, rating: 2450, region: "ZA" },
    { rank: 2, name: "Naija Vanguards", tag: "[NVG]", members: 50, rating: 2310, region: "NG" },
    { rank: 3, name: "Kenya Elite", tag: "[K-EL]", members: 42, rating: 2180, region: "KE" },
  ];

  return (
    <div className="p-4 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-white uppercase italic">Top Clans</h2>
        <p className="text-sm text-stone-400">BSCA Official Leaderboards</p>
      </div>
      <div className="bg-stone-900/50 rounded-xl border border-stone-800 p-2">
        <div className="flex items-center px-3 py-2 text-[10px] font-bold text-stone-500 uppercase tracking-widest border-b border-stone-800/50 mb-2">
          <div className="w-6">#</div>
          <div className="flex-1">Clan Details</div>
          <div className="text-right">Rating</div>
        </div>
        <div className="space-y-2">
          {clans.map((clan) => (
            <div key={clan.name} className="flex items-center px-3 py-2 bg-stone-900 rounded-lg border border-stone-800/80">
              <div className={`w-6 font-black text-sm ${clan.rank <= 3 ? 'text-red-500' : 'text-stone-500'}`}>{clan.rank}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-stone-100 text-sm">{clan.name}</h4>
                  <span className="text-[9px] bg-stone-950 text-stone-400 px-1 py-0.5 rounded border border-stone-800">{clan.tag}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-stone-500 mt-0.5">
                  <span className="flex items-center gap-1"><Users size={10}/> {clan.members}/50</span>
                </div>
              </div>
              <div className="text-right text-sm font-black text-white">{clan.rating}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- ARMORY TAB (Read Only for Users) ---
function ArmoryTab() {
  const loadouts = getMockLoadouts();

  return (
    <div className="p-4 animate-fade-in relative h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-white uppercase italic">Meta Armory</h2>
        <p className="text-sm text-stone-400">Official curated loadouts.</p>
      </div>

      <div className="space-y-4 pb-8">
        {loadouts.map((loadout, i) => (
          <div key={i} className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-stone-800 bg-stone-950/50 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-black text-white italic tracking-wide">{loadout.gun}</h3>
                <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">{loadout.type}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-stone-500">Curated by</p>
                <p className="text-xs font-bold text-stone-300">{loadout.author}</p>
              </div>
            </div>
            
            <div className="p-4 bg-stone-900">
              <div className="inline-block px-2 py-1 bg-stone-800 text-stone-300 text-[10px] font-bold uppercase rounded mb-3 border border-stone-700/50">
                Style: {loadout.playstyle}
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-4">
                {loadout.attachments.map((att, idx) => (
                  <div key={idx} className="bg-stone-950 px-2 py-1.5 rounded-md text-[11px] font-medium text-stone-400 border border-stone-800/80 flex items-center gap-1.5 truncate">
                    <Crosshair size={10} className="text-red-500/50 shrink-0" /> <span className="truncate">{att}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mt-2 pt-3 border-t border-stone-800/50">
                <button className="flex items-center gap-1.5 text-stone-500 hover:text-red-500 transition-colors">
                  <Heart size={16} className={loadout.likes > 0 ? "text-red-500" : ""} fill={loadout.likes > 0 ? "#ef4444" : "none"} /> 
                  <span className="text-xs font-bold text-stone-300">{loadout.likes}</span>
                </button>
                <button className="text-[10px] font-bold text-white bg-stone-800 border border-stone-700 px-3 py-1.5 rounded hover:bg-stone-700 transition-colors uppercase tracking-wider">
                  Copy Build
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- UTILS ---
function NavItem({ icon, label, isActive, onClick }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-14 gap-1 transition-colors ${isActive ? 'text-white' : 'text-stone-500'}`}>
      {React.cloneElement(icon, { size: 20, strokeWidth: isActive ? 2.5 : 2, className: isActive ? 'text-red-500 drop-shadow-[0_0_8px_rgba(220,38,38,0.6)]' : '' })}
      <span className={`text-[9px] font-bold tracking-wider ${isActive ? 'opacity-100 text-red-100' : 'opacity-0'}`}>{label}</span>
    </button>
  );
}

function getAvatarColor(name) {
  const colors = ['bg-red-600', 'bg-blue-600', 'bg-green-600', 'bg-amber-600', 'bg-purple-600'];
  return colors[name.length % colors.length];
}

function getMockPosts() {
  return [
    { id: 'mock1', user: "Naija_Striker", tag: "LFG", tagColor: "text-blue-400 border-blue-400/30 bg-blue-400/10", content: "Need 2 cracked players for Ranked Squads. Currently Diamond III pushing to Legend tonight. Mic required. WA Server.", likes: 24, comments: 8, createdAt: Date.now() - 1000 * 60 * 10 },
    { id: 'mock2', user: "CapeTownViper", tag: "Highlight", tagColor: "text-amber-400 border-amber-400/30 bg-amber-400/10", content: "1v4 clutch in the final zone using the URB! The movement in this patch feels so smooth. 🌪️🔥", hasVideo: true, likes: 342, comments: 56, createdAt: Date.now() - 1000 * 60 * 120 }
  ];
}

function getMockLoadouts() {
  return [
    { id: 'mockL1', gun: "KAG-6", type: "Assault Rifle", author: "BSCA_Admin", playstyle: "Aggressive Beamer", attachments: ["Muzzle Brake", "Ranger Barrel", "50 Rnd Mag", "Stippled Grip", "Skeleton Stock"], likes: 842 },
    { id: 'mockL2', gun: "INP-9", type: "SMG", author: "BSCA_Admin", playstyle: "Movement King", attachments: ["Suppressor", "Tac Laser", "No Stock", "Extended Mag", "Sleight of Hand"], likes: 651 }
  ];
}
