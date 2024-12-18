import { supabase } from './supabaseClient';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'user' | 'admin';
  created_at: Date;
  last_login_at: Date;
}

export const createUser = async (userData: {
  email: string;
  name?: string;
}): Promise<User> => {
  try {
    // Check if user already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', userData.email)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    if (existingUser) {
      // Update last login time
      const { data: updatedUser, error: updateError } = await supabase
        .from('profiles')
        .update({ last_login_at: new Date() })
        .eq('email', userData.email)
        .select()
        .single();

      if (updateError) throw updateError;
      return updatedUser as User;
    }

    // Create new user
    const newUser = {
      id: userData.email,
      email: userData.email,
      name: userData.name || '',
      role: 'user',
      created_at: new Date(),
      last_login_at: new Date(),
    };

    const { data, error } = await supabase
      .from('profiles')
      .insert([newUser])
      .select()
      .single();

    if (error) throw error;
    return data as User;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getUser = async (email: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (error) throw error;
    return data as User;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as User[];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

export const isAdmin = async (email: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('email', email)
      .single();

    if (error) throw error;
    return data?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};
