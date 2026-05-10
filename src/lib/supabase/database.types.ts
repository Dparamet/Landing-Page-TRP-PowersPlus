export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      admin_profiles: {
        Row: {
          created_at: string | null;
          role: 'owner' | 'editor';
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          role?: 'owner' | 'editor';
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          role?: 'owner' | 'editor';
          user_id?: string;
        };
        Relationships: [];
      };
      media_assets: {
        Row: {
          alt_en: string;
          alt_th: string;
          bucket: string;
          created_at: string | null;
          id: string;
          mime_type: string;
          path: string;
          public_url: string;
          size_bytes: number | null;
          updated_at: string | null;
        };
        Insert: {
          alt_en?: string;
          alt_th?: string;
          bucket?: string;
          created_at?: string | null;
          id?: string;
          mime_type: string;
          path: string;
          public_url: string;
          size_bytes?: number | null;
          updated_at?: string | null;
        };
        Update: {
          alt_en?: string;
          alt_th?: string;
          bucket?: string;
          created_at?: string | null;
          id?: string;
          mime_type?: string;
          path?: string;
          public_url?: string;
          size_bytes?: number | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      portfolio_projects: {
        Row: {
          accent: 'orange' | 'blue';
          category_key: string;
          cover_image_id: string | null;
          created_at: string | null;
          description: Json;
          gallery: Json;
          id: string;
          location: Json;
          metrics: Json;
          published: boolean;
          slug: string;
          sort_order: number;
          system_type: Json;
          title: Json;
          updated_at: string | null;
        };
        Insert: {
          accent?: 'orange' | 'blue';
          category_key: string;
          cover_image_id?: string | null;
          created_at?: string | null;
          description: Json;
          gallery?: Json;
          id?: string;
          location: Json;
          metrics?: Json;
          published?: boolean;
          slug: string;
          sort_order?: number;
          system_type: Json;
          title: Json;
          updated_at?: string | null;
        };
        Update: {
          accent?: 'orange' | 'blue';
          category_key?: string;
          cover_image_id?: string | null;
          created_at?: string | null;
          description?: Json;
          gallery?: Json;
          id?: string;
          location?: Json;
          metrics?: Json;
          published?: boolean;
          slug?: string;
          sort_order?: number;
          system_type?: Json;
          title?: Json;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'portfolio_projects_category_key_fkey';
            columns: ['category_key'];
            isOneToOne: false;
            referencedRelation: 'services';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'portfolio_projects_cover_image_id_fkey';
            columns: ['cover_image_id'];
            isOneToOne: false;
            referencedRelation: 'media_assets';
            referencedColumns: ['id'];
          },
        ];
      };
      services: {
        Row: {
          accent: 'orange' | 'blue';
          best_for: Json;
          created_at: string | null;
          description: Json;
          id: string;
          includes: Json;
          line_message: Json;
          prepare: Json;
          published: boolean;
          short_title: Json;
          sort_order: number;
          title: Json;
          updated_at: string | null;
        };
        Insert: {
          accent?: 'orange' | 'blue';
          best_for: Json;
          created_at?: string | null;
          description: Json;
          id: string;
          includes?: Json;
          line_message: Json;
          prepare?: Json;
          published?: boolean;
          short_title: Json;
          sort_order?: number;
          title: Json;
          updated_at?: string | null;
        };
        Update: {
          accent?: 'orange' | 'blue';
          best_for?: Json;
          created_at?: string | null;
          description?: Json;
          id?: string;
          includes?: Json;
          line_message?: Json;
          prepare?: Json;
          published?: boolean;
          short_title?: Json;
          sort_order?: number;
          title?: Json;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          address: string;
          created_at: string | null;
          email: string;
          facebook_display: string;
          facebook_url: string;
          google_maps_embed_url: string;
          google_maps_search_url: string;
          id: boolean;
          line_id: string;
          line_url: string;
          name: string;
          phone_display: string;
          phone_href: string;
          updated_at: string | null;
        };
        Insert: {
          address?: string;
          created_at?: string | null;
          email?: string;
          facebook_display?: string;
          facebook_url?: string;
          google_maps_embed_url?: string;
          google_maps_search_url?: string;
          id?: boolean;
          line_id?: string;
          line_url?: string;
          name?: string;
          phone_display?: string;
          phone_href?: string;
          updated_at?: string | null;
        };
        Update: {
          address?: string;
          created_at?: string | null;
          email?: string;
          facebook_display?: string;
          facebook_url?: string;
          google_maps_embed_url?: string;
          google_maps_search_url?: string;
          id?: boolean;
          line_id?: string;
          line_url?: string;
          name?: string;
          phone_display?: string;
          phone_href?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
