import React, { useState, useEffect, useRef } from "react";
import {
  User, Mail, ArrowLeft, Trash2, Calendar, FileText, ExternalLink,
  Edit2, Camera, Check, ShieldAlert, Sparkles, Heart, Activity,
  AlertTriangle, BookOpen, CheckCircle, HelpCircle, ChevronRight
} from "lucide-react";
import { supabase } from "../supabase";
import { TransformationResponse } from "../types";

interface ProfilePageProps {
  user: any;
  profile: any;
  onRefreshProfile: () => void;
  onBackToHome: () => void;
  isLightMode: boolean;
}

export default function ProfilePage({
  user,
  profile,
  onRefreshProfile,
  onBackToHome,
  isLightMode
}: ProfilePageProps) {
  const [name, setName] = useState("");
  const [avatarBase64, setAvatarBase64] = useState("");
  const [uploads, setUploads] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Selected history item to display in detail modal
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setName(profile.full_name || "");
      setAvatarBase64(profile.avatar_url || "");
    }
    fetchHistory();
  }, [profile, user]);

  const fetchHistory = async () => {
    if (!user) return;
    setLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from("uploads")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      setUploads(data || []);
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setSaveSuccess(false);

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: name,
          avatar_url: avatarBase64
        }
      });
      if (error) throw error;
      
      // Also update profiles table just in case they have it
      await supabase.from("profiles").upsert({
        id: user.id,
        full_name: name,
        avatar_url: avatarBase64
      });

      setSaveSuccess(true);
      onRefreshProfile();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving profile:", err);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setAvatarBase64(base64);
        // Auto-save the avatar picture directly for smooth UX
        saveAvatar(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveAvatar = async (base64: string) => {
    try {
      await supabase.auth.updateUser({
        data: { avatar_url: base64 }
      });
      await supabase.from("profiles").upsert({
        id: user.id,
        avatar_url: base64
      });
      onRefreshProfile();
    } catch (err) {
      console.error("Error updating avatar:", err);
    }
  };

  const handleDeleteUpload = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this translation record?")) return;

    try {
      const { error } = await supabase
        .from("uploads")
        .delete()
        .eq("id", id);
      if (error) throw error;
      
      setUploads(prev => prev.filter(u => u.id !== id));
      if (selectedItem && selectedItem.id === id) {
        setSelectedItem(null);
      }
    } catch (err) {
      console.error("Error deleting upload:", err);
    }
  };

  const parseSimplifiedText = (text: string): TransformationResponse | null => {
    try {
      return JSON.parse(text);
    } catch {
      // Return a basic fallback response object if the column stores plain text
      return {
        stabilizingReassurance: "Reviewing your secure clinical archive record.",
        simplifiedExplanation: text || "No detailed breakdown available for this record.",
        urgencyLevel: 3,
        urgencyAnalysis: "This represents an archived diagnostic entry.",
        primaryFocusAction: "Consult with your healthcare practitioner regarding these logs.",
        keyActions: ["Re-verify these notes with your care provider."],
        jargonMappings: [],
        questionsToAskDoctor: []
      };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-fade-in text-left">
      {/* Back Button */}
      <button
        onClick={onBackToHome}
        className={`inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest mb-8 transition-colors cursor-pointer ${
          isLightMode ? "text-slate-500 hover:text-indigo-600" : "text-gray-400 hover:text-white"
        }`}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Sanctuary Home
      </button>

      {/* Main Profile Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className={`glass-panel rounded-3xl p-6 relative overflow-hidden ${
            isLightMode ? "bg-white/90 border-slate-200" : "bg-midnight-light/40 border-white/5"
          }`}>
            <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-tr from-luma-glow/10 to-luma-lavender/10 rounded-full blur-2xl pointer-events-none" />

            {/* Profile Avatar Edit */}
            <div className="flex flex-col items-center space-y-4 mb-6">
              <div className="relative group">
                <div className={`w-28 h-28 rounded-full border-2 flex items-center justify-center overflow-hidden transition-all duration-300 ${
                  isLightMode ? "border-slate-200 bg-slate-100" : "border-white/10 bg-midnight-deep"
                }`}>
                  {avatarBase64 ? (
                    <img
                      src={avatarBase64}
                      className="w-full h-full object-cover"
                      alt="Avatar"
                    />
                  ) : (
                    <User className="w-12 h-12 text-gray-500" />
                  )}
                </div>

                {/* Hover overlay to upload photo */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                  title="Upload profile picture"
                >
                  <Camera className="w-5 h-5" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div className="text-center">
                <h4 className={`text-lg font-serif font-semibold ${isLightMode ? "text-slate-800" : "text-white"}`}>
                  {profile?.full_name || "Sanctuary User"}
                </h4>
                <p className="text-xs text-gray-500 font-mono flex items-center justify-center gap-1.5 mt-0.5">
                  <Mail className="w-3 h-3" />
                  {user?.email}
                </p>
              </div>
            </div>

            {/* Profile Fields Form */}
            <form onSubmit={handleSaveProfile} className="space-y-4 pt-4 border-t border-white/5">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono tracking-widest text-gray-400 block">
                  Sanctuary Nickname / Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className={`w-full px-4 py-3 rounded-2xl border text-xs outline-none transition-all ${
                      isLightMode
                        ? "bg-slate-50 border-slate-200 focus:border-indigo-500 focus:bg-white text-slate-800"
                        : "bg-midnight border-white/5 focus:border-luma-glow/40 focus:bg-midnight-deep text-white"
                    }`}
                  />
                </div>
              </div>

              {saveSuccess && (
                <div className="p-3 rounded-xl border border-luma-teal/20 bg-luma-teal/5 text-xs text-luma-teal flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Profile updated successfully.</span>
                </div>
              )}

              <button
                type="submit"
                disabled={saveLoading}
                className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-luma-glow to-luma-lavender text-midnight font-mono text-xs uppercase tracking-widest font-semibold hover:opacity-90 active:scale-98 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-40"
              >
                {saveLoading ? "Saving..." : "Save Profile Details"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Upload History Log */}
        <div className="lg:col-span-8 space-y-6">
          <div className={`glass-panel rounded-3xl p-6 md:p-8 ${
            isLightMode ? "bg-white/90 border-slate-200" : "bg-midnight-light/40 border-white/5"
          }`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-luma-glow font-semibold p-1.5 bg-luma-glow/10 rounded-lg">
                  History Log
                </span>
                <h3 className={`font-serif text-xl font-medium mt-3 ${isLightMode ? "text-slate-800" : "text-white"}`}>
                  Your Secure Translations Vault
                </h3>
              </div>
              <span className="text-xs text-gray-500 font-mono">
                {uploads.length} Total Records
              </span>
            </div>

            {loadingHistory ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-8 h-8 rounded-full border-2 border-luma-glow border-t-transparent animate-spin mx-auto" />
                <span className="text-xs font-mono text-gray-400 block">Decrypting vault history...</span>
              </div>
            ) : uploads.length === 0 ? (
              <div className="py-20 text-center border border-dashed border-white/5 rounded-2xl p-6">
                <FileText className="w-8 h-8 text-gray-500 mx-auto mb-3" />
                <h4 className={`font-serif text-sm font-medium ${isLightMode ? "text-slate-800" : "text-white"}`}>
                  No translations in your folder yet
                </h4>
                <p className="text-xs text-gray-500 max-w-xs mx-auto mt-1 leading-relaxed">
                  Go back to the sanctuary landing page and submit doctor notes or clinic sheets to see them stored here securely.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {uploads.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between group ${
                      isLightMode
                        ? "bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-indigo-200"
                        : "bg-white/2 border-white/5 hover:bg-white/4 hover:border-luma-glow/30"
                    }`}
                  >
                    <div className="flex items-center gap-4.5">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isLightMode ? "bg-indigo-50 text-indigo-600" : "bg-white/5 text-luma-glow"
                      }`}>
                        <FileText className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <h4 className={`text-sm font-serif font-medium ${
                          isLightMode ? "text-slate-800" : "text-white"
                        }`}>
                          {item.file_name}
                        </h4>
                        <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1.5 mt-0.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(item.created_at).toLocaleDateString()} at{" "}
                          {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-luma-glow opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        Open Vault <ExternalLink className="w-3 h-3" />
                      </span>
                      <button
                        onClick={(e) => handleDeleteUpload(item.id, e)}
                        className={`p-2 rounded-xl transition-all cursor-pointer ${
                          isLightMode
                            ? "hover:bg-red-50 text-slate-400 hover:text-red-600"
                            : "hover:bg-white/5 text-gray-500 hover:text-red-400"
                        }`}
                        title="Delete from history"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* History Record Details Popup Modal */}
      {selectedItem && (() => {
        const result = parseSimplifiedText(selectedItem.simplified_text);
        if (!result) return null;
        
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-midnight-deep/75 backdrop-blur-md cursor-pointer"
              onClick={() => setSelectedItem(null)}
            />
            
            <div className={`relative w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-3xl p-6 md:p-8 border shadow-2xl transition-all duration-300 ${
              isLightMode
                ? "bg-slate-50/95 border-slate-200 text-slate-800"
                : "bg-midnight-light/95 border-white/10 text-gray-200"
            }`}>
              
              {/* Close button */}
              <button
                onClick={() => setSelectedItem(null)}
                className={`absolute top-5 right-5 p-2 rounded-full border transition-all cursor-pointer ${
                  isLightMode
                    ? "border-slate-200 hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                    : "border-white/5 hover:border-white/15 text-gray-500 hover:text-white"
                }`}
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-6 text-left">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#B0B3C1]">
                    Secure Translation Archive
                  </span>
                  <h3 className={`text-2xl font-serif font-medium mt-1 ${isLightMode ? "text-slate-900" : "text-white"}`}>
                    {selectedItem.file_name}
                  </h3>
                  <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                    Saved on {new Date(selectedItem.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="h-[1px] bg-white/5" />

                {/* Structured bento dashboard layout from the results */}
                <div className="space-y-6">
                  {/* Stabilizing Reassurance */}
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-luma-glow/10 via-luma-lavender/5 to-luma-teal/10 border border-white/5 shadow-md">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-luma-glow/10 flex items-center justify-center text-luma-glow shrink-0">
                        <Heart className="w-5 h-5 fill-luma-glow/20" />
                      </div>
                      <div>
                        <h4 className="font-serif text-sm font-medium uppercase tracking-wider text-gray-400 mb-1 animate-pulse">
                          Reassurance Layer
                        </h4>
                        <p className="text-base font-serif italic text-white leading-relaxed">
                          &ldquo;{result.stabilizingReassurance}&rdquo;
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Simplified Explanation */}
                    <div className="p-6 rounded-2xl bg-midnight border border-white/5 shadow-xl space-y-4">
                      <div className="flex items-center gap-2 text-luma-glow">
                        <Sparkles className="w-4 h-4" />
                        <h5 className="font-serif text-sm uppercase tracking-wider font-semibold">
                          Simplified Explanation
                        </h5>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        {result.simplifiedExplanation}
                      </p>
                    </div>

                    {/* Urgency Guidance */}
                    <div className="p-6 rounded-2xl bg-midnight border border-white/5 shadow-xl space-y-4">
                      <div className="flex items-center gap-2 text-[#C084FC]">
                        <Activity className="w-4 h-4" />
                        <h5 className="font-serif text-sm uppercase tracking-wider font-semibold">
                          Urgency Guidance
                        </h5>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-2xl font-serif font-black text-white px-4 py-2 rounded-2xl bg-white/5 border border-white/10 shadow-sm">
                          {result.urgencyLevel}
                          <span className="text-xs text-gray-500 font-sans font-normal ml-0.5">/10</span>
                        </div>
                        <div className="text-xs leading-relaxed text-gray-400">
                          <strong>Visual Compass is {result.urgencyLevel <= 4 ? "Peaceful Green" : "Gentle Orange"}.</strong><br />
                          {result.urgencyAnalysis}
                        </div>
                      </div>
                    </div>

                    {/* Jargon Translation matrix */}
                    {result.jargonMappings && result.jargonMappings.length > 0 && (
                      <div className="p-6 rounded-2xl bg-midnight border border-white/5 shadow-xl md:col-span-2 space-y-4">
                        <div className="flex items-center gap-2 text-[#22D3EE]">
                          <BookOpen className="w-4 h-4" />
                          <h5 className="font-serif text-sm uppercase tracking-wider font-semibold">
                            Parsed Jargon Breakdown
                          </h5>
                        </div>
                        <div className="space-y-3">
                          {result.jargonMappings.map((j, idx) => (
                            <div
                              key={idx}
                              className="p-3.5 rounded-xl bg-white/2 border border-white/5 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                            >
                              <span className="font-mono text-xs text-pink-300 line-through tracking-wide">
                                {j.scaryTerm}
                              </span>
                              <span className="w-4 h-4 shrink-0 hidden sm:flex items-center justify-center text-gray-500">
                                <ChevronRight className="w-3.5 h-3.5" />
                              </span>
                              <span className="font-serif text-xs font-semibold text-luma-glow">
                                {j.gentleTranslation}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Next Action checklist */}
                    <div className="p-6 rounded-2xl bg-midnight border border-white/5 shadow-xl space-y-4">
                      <div className="flex items-center gap-2 text-luma-teal">
                        <CheckCircle className="w-4.5 h-4.5" />
                        <h5 className="font-serif text-sm uppercase tracking-wider font-semibold">
                          Empowering Next Steps
                        </h5>
                      </div>
                      <ul className="space-y-2 text-xs text-gray-300">
                        {result.keyActions.map((act, idx) => (
                          <li key={idx} className="flex gap-2.5 items-start">
                            <span className="w-5 h-5 rounded-full bg-luma-teal/10 flex items-center justify-center text-luma-teal shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="leading-relaxed">{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* consult prompts */}
                    <div className="p-6 rounded-2xl bg-midnight border border-white/5 shadow-xl space-y-4">
                      <div className="flex items-center gap-2 text-[#E9D5FF]">
                        <HelpCircle className="w-4.5 h-4.5" />
                        <h5 className="font-serif text-sm uppercase tracking-wider font-semibold">
                          Empathetic Consult Prompts
                        </h5>
                      </div>
                      <ul className="space-y-2 text-xs text-gray-300">
                        {result.questionsToAskDoctor.map((q, idx) => (
                          <li key={idx} className="flex gap-2 items-start">
                            <span className="w-1.5 h-1.5 bg-[#C084FC] rounded-full shrink-0 mt-1.5" />
                            <span className="leading-relaxed">{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex justify-end">
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="py-2.5 px-6 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono uppercase tracking-wider cursor-pointer transition-colors"
                  >
                    Close record
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// Inline modal close helper
function X({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
