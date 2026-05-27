import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || "";

export interface SupabaseUser {
  id: string;
  email: string;
}

export interface SupabaseSession {
  access_token: string;
  user: SupabaseUser;
}

const useRealSupabase = !!(supabaseUrl && supabaseAnonKey);

const realSupabase = useRealSupabase ? createClient(supabaseUrl, supabaseAnonKey) : null;

// Mock database keys in localStorage
const STORAGE_USERS_KEY = "luma_mock_users";
const STORAGE_PROFILES_KEY = "luma_mock_profiles";
const STORAGE_UPLOADS_KEY = "luma_mock_uploads";
const STORAGE_SESSION_KEY = "luma_mock_session";

class MockSupabaseClient {
  private authCallbacks: Array<(event: string, session: any) => void> = [];

  constructor() {
    // Load defaults if empty
    if (!localStorage.getItem(STORAGE_USERS_KEY)) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_PROFILES_KEY)) {
      localStorage.setItem(STORAGE_PROFILES_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_UPLOADS_KEY)) {
      localStorage.setItem(STORAGE_UPLOADS_KEY, JSON.stringify([]));
    }
  }

  private getSessionData(): any {
    const data = localStorage.getItem(STORAGE_SESSION_KEY);
    return data ? JSON.parse(data) : null;
  }

  private setSessionData(session: any) {
    if (session) {
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_SESSION_KEY);
    }
  }

  auth = {
    signUp: async ({ email }: { email: string }) => {
      const users = JSON.parse(localStorage.getItem(STORAGE_USERS_KEY) || "[]");
      if (users.find((u: any) => u.email === email)) {
        return { data: { user: null, session: null }, error: new Error("User already exists") };
      }
      const newUser = { id: Math.random().toString(36).substring(2, 10), email };
      users.push(newUser);
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));

      // Create profile
      const profiles = JSON.parse(localStorage.getItem(STORAGE_PROFILES_KEY) || "[]");
      const defaultProfile = {
        id: newUser.id,
        full_name: email.split("@")[0],
        avatar_url: "",
        updated_at: new Date().toISOString()
      };
      profiles.push(defaultProfile);
      localStorage.setItem(STORAGE_PROFILES_KEY, JSON.stringify(profiles));

      const session = { access_token: "mock_token_" + newUser.id, user: newUser };
      this.setSessionData(session);
      this.notifyAuthChange("SIGNED_IN", session);
      return { data: { user: newUser, session }, error: null };
    },

    signInWithPassword: async ({ email }: { email: string }) => {
      const users = JSON.parse(localStorage.getItem(STORAGE_USERS_KEY) || "[]");
      let user = users.find((u: any) => u.email === email);
      if (!user) {
        // Auto-create to make UX seamless for testing
        const newUser = { id: Math.random().toString(36).substring(2, 10), email };
        users.push(newUser);
        localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));

        const profiles = JSON.parse(localStorage.getItem(STORAGE_PROFILES_KEY) || "[]");
        const defaultProfile = {
          id: newUser.id,
          full_name: email.split("@")[0],
          avatar_url: "",
          updated_at: new Date().toISOString()
        };
        profiles.push(defaultProfile);
        localStorage.setItem(STORAGE_PROFILES_KEY, JSON.stringify(profiles));
        user = newUser;
      }
      const session = { access_token: "mock_token_" + user.id, user };
      this.setSessionData(session);
      this.notifyAuthChange("SIGNED_IN", session);
      return { data: { user, session }, error: null };
    },

    signOut: async () => {
      this.setSessionData(null);
      this.notifyAuthChange("SIGNED_OUT", null);
      return { error: null };
    },

    getSession: async () => {
      const session = this.getSessionData();
      return { data: { session }, error: null };
    },

    getUser: async () => {
      const session = this.getSessionData();
      return { data: { user: session ? session.user : null }, error: null };
    },

    updateUser: async ({ data }: { data: any }) => {
      const session = this.getSessionData();
      if (!session || !session.user) {
        return { data: { user: null }, error: new Error("No active session") };
      }
      session.user.user_metadata = {
        ...session.user.user_metadata,
        ...data
      };
      this.setSessionData(session);
      
      // Update profiles too
      const profiles = JSON.parse(localStorage.getItem(STORAGE_PROFILES_KEY) || "[]");
      const index = profiles.findIndex((p: any) => p.id === session.user.id);
      if (index !== -1) {
        profiles[index] = {
          ...profiles[index],
          full_name: data.full_name || profiles[index].full_name,
          avatar_url: data.avatar_url || profiles[index].avatar_url,
          updated_at: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_PROFILES_KEY, JSON.stringify(profiles));
      }

      this.notifyAuthChange("USER_UPDATED", session);
      return { data: { user: session.user }, error: null };
    },

    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      this.authCallbacks.push(callback);
      const session = this.getSessionData();
      // Wait a tick to allow component mounting before callback fires
      setTimeout(() => {
        callback(session ? "SIGNED_IN" : "SIGNED_OUT", session);
      }, 0);
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              this.authCallbacks = this.authCallbacks.filter(cb => cb !== callback);
            }
          }
        }
      };
    }
  };

  private notifyAuthChange(event: string, session: any) {
    this.authCallbacks.forEach(cb => cb(event, session));
  }

  from(table: string) {
    return {
      select: (columns: string = "*") => {
        return {
          eq: (field: string, val: any) => {
            return {
              single: async () => {
                if (table === "profiles") {
                  const profiles = JSON.parse(localStorage.getItem(STORAGE_PROFILES_KEY) || "[]");
                  const profile = profiles.find((p: any) => p[field] === val);
                  return { data: profile || null, error: profile ? null : new Error("Profile not found") };
                }
                return { data: null, error: new Error("Table query not supported") };
              },
              order: (orderBy: string, { ascending }: any = {}) => {
                const uploads = JSON.parse(localStorage.getItem(STORAGE_UPLOADS_KEY) || "[]");
                const filtered = uploads.filter((u: any) => u[field] === val);
                filtered.sort((a: any, b: any) => {
                  const timeA = new Date(a[orderBy]).getTime();
                  const timeB = new Date(b[orderBy]).getTime();
                  return ascending ? timeA - timeB : timeB - timeA;
                });
                return {
                  limit: async (num: number) => {
                    return { data: filtered.slice(0, num), error: null };
                  },
                  then: async (resolve: any) => {
                    resolve({ data: filtered, error: null });
                  }
                };
              },
              then: async (resolve: any) => {
                if (table === "uploads") {
                  const uploads = JSON.parse(localStorage.getItem(STORAGE_UPLOADS_KEY) || "[]");
                  const filtered = uploads.filter((u: any) => u[field] === val);
                  resolve({ data: filtered, error: null });
                } else {
                  resolve({ data: null, error: new Error("Table select not supported") });
                }
              }
            };
          }
        };
      },

      insert: async (row: any) => {
        if (table === "uploads") {
          const uploads = JSON.parse(localStorage.getItem(STORAGE_UPLOADS_KEY) || "[]");
          const newUpload = {
            id: Math.random().toString(36).substring(2, 10),
            created_at: new Date().toISOString(),
            ...row
          };
          uploads.push(newUpload);
          localStorage.setItem(STORAGE_UPLOADS_KEY, JSON.stringify(uploads));
          return { data: [newUpload], error: null };
        }
        return { data: null, error: new Error("Table insert not supported") };
      },

      upsert: async (row: any) => {
        if (table === "profiles") {
          const profiles = JSON.parse(localStorage.getItem(STORAGE_PROFILES_KEY) || "[]");
          const index = profiles.findIndex((p: any) => p.id === row.id);
          if (index !== -1) {
            profiles[index] = { ...profiles[index], ...row, updated_at: new Date().toISOString() };
          } else {
            profiles.push({ ...row, updated_at: new Date().toISOString() });
          }
          localStorage.setItem(STORAGE_PROFILES_KEY, JSON.stringify(profiles));
          return { data: row, error: null };
        }
        return { data: null, error: new Error("Table upsert not supported") };
      },

      delete: () => {
        return {
          eq: async (field: string, val: any) => {
            if (table === "uploads") {
              const uploads = JSON.parse(localStorage.getItem(STORAGE_UPLOADS_KEY) || "[]");
              const filtered = uploads.filter((u: any) => u[field] !== val);
              localStorage.setItem(STORAGE_UPLOADS_KEY, JSON.stringify(filtered));
              return { error: null };
            }
            return { error: new Error("Table delete not supported") };
          }
        };
      }
    };
  }
}

export const supabase = useRealSupabase ? realSupabase! : (new MockSupabaseClient() as any);
export const isMocked = !useRealSupabase;
