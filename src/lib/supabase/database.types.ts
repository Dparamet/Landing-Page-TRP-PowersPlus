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
      faq_items: {
        Row: {
          answer: Json;
          created_at: string | null;
          deleted_at: string | null;
          id: string;
          published: boolean;
          purge_after: string | null;
          question: Json;
          sort_order: number;
          updated_at: string | null;
        };
        Insert: {
          answer: Json;
          created_at?: string | null;
          deleted_at?: string | null;
          id?: string;
          published?: boolean;
          purge_after?: string | null;
          question: Json;
          sort_order?: number;
          updated_at?: string | null;
        };
        Update: {
          answer?: Json;
          created_at?: string | null;
          deleted_at?: string | null;
          id?: string;
          published?: boolean;
          purge_after?: string | null;
          question?: Json;
          sort_order?: number;
          updated_at?: string | null;
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
      contact_items: {
        Row: {
          copy_value: string | null;
          created_at: string | null;
          deleted_at: string | null;
          external: boolean;
          href: string | null;
          icon: string;
          id: string;
          label: Json;
          published: boolean;
          purge_after: string | null;
          sort_order: number;
          type: string;
          updated_at: string | null;
          value: Json;
        };
        Insert: {
          copy_value?: string | null;
          created_at?: string | null;
          deleted_at?: string | null;
          external?: boolean;
          href?: string | null;
          icon?: string;
          id?: string;
          label: Json;
          published?: boolean;
          purge_after?: string | null;
          sort_order?: number;
          type: string;
          updated_at?: string | null;
          value: Json;
        };
        Update: {
          copy_value?: string | null;
          created_at?: string | null;
          deleted_at?: string | null;
          external?: boolean;
          href?: string | null;
          icon?: string;
          id?: string;
          label?: Json;
          published?: boolean;
          purge_after?: string | null;
          sort_order?: number;
          type?: string;
          updated_at?: string | null;
          value?: Json;
        };
        Relationships: [];
      };
      portfolio_projects: {
        Row: {
          accent: 'orange' | 'blue';
          category_key: string;
          cover_image_id: string | null;
          created_at: string | null;
          deleted_at: string | null;
          description: Json;
          gallery: Json;
          id: string;
          location: Json;
          metrics: Json;
          purge_after: string | null;
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
          deleted_at?: string | null;
          description: Json;
          gallery?: Json;
          id?: string;
          location: Json;
          metrics?: Json;
          purge_after?: string | null;
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
          deleted_at?: string | null;
          description?: Json;
          gallery?: Json;
          id?: string;
          location?: Json;
          metrics?: Json;
          purge_after?: string | null;
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
      portfolio_image_overrides: {
        Row: {
          alt_th: string;
          created_at: string | null;
          deleted_at: string | null;
          image_slot: 'cover' | 'before' | 'during' | 'after';
          image_url: string;
          media_asset_id: string | null;
          project_key: string;
          purge_after: string | null;
          updated_at: string | null;
        };
        Insert: {
          alt_th?: string;
          created_at?: string | null;
          deleted_at?: string | null;
          image_slot: 'cover' | 'before' | 'during' | 'after';
          image_url: string;
          media_asset_id?: string | null;
          project_key: string;
          purge_after?: string | null;
          updated_at?: string | null;
        };
        Update: {
          alt_th?: string;
          created_at?: string | null;
          deleted_at?: string | null;
          image_slot?: 'cover' | 'before' | 'during' | 'after';
          image_url?: string;
          media_asset_id?: string | null;
          project_key?: string;
          purge_after?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'portfolio_image_overrides_media_asset_id_fkey';
            columns: ['media_asset_id'];
            isOneToOne: false;
            referencedRelation: 'media_assets';
            referencedColumns: ['id'];
          },
        ];
      };
      process_steps: {
        Row: {
          created_at: string | null;
          deleted_at: string | null;
          description: Json;
          id: string;
          published: boolean;
          purge_after: string | null;
          sort_order: number;
          title: Json;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          deleted_at?: string | null;
          description: Json;
          id?: string;
          published?: boolean;
          purge_after?: string | null;
          sort_order?: number;
          title: Json;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          deleted_at?: string | null;
          description?: Json;
          id?: string;
          published?: boolean;
          purge_after?: string | null;
          sort_order?: number;
          title?: Json;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      services: {
        Row: {
          accent: 'orange' | 'blue';
          best_for: Json;
          created_at: string | null;
          deleted_at: string | null;
          description: Json;
          id: string;
          includes: Json;
          line_message: Json;
          prepare: Json;
          published: boolean;
          purge_after: string | null;
          short_title: Json;
          sort_order: number;
          title: Json;
          updated_at: string | null;
        };
        Insert: {
          accent?: 'orange' | 'blue';
          best_for: Json;
          created_at?: string | null;
          deleted_at?: string | null;
          description: Json;
          id: string;
          includes?: Json;
          line_message: Json;
          prepare?: Json;
          published?: boolean;
          purge_after?: string | null;
          short_title: Json;
          sort_order?: number;
          title: Json;
          updated_at?: string | null;
        };
        Update: {
          accent?: 'orange' | 'blue';
          best_for?: Json;
          created_at?: string | null;
          deleted_at?: string | null;
          description?: Json;
          id?: string;
          includes?: Json;
          line_message?: Json;
          prepare?: Json;
          published?: boolean;
          purge_after?: string | null;
          short_title?: Json;
          sort_order?: number;
          title?: Json;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      standard_items: {
        Row: {
          alt_text: string;
          created_at: string | null;
          deleted_at: string | null;
          id: string;
          hover_image_url: string | null;
          hover_media_asset_id: string | null;
          image_url: string | null;
          media_asset_id: string | null;
          published: boolean;
          purge_after: string | null;
          sort_order: number;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          alt_text?: string;
          created_at?: string | null;
          deleted_at?: string | null;
          id: string;
          hover_image_url?: string | null;
          hover_media_asset_id?: string | null;
          image_url?: string | null;
          media_asset_id?: string | null;
          published?: boolean;
          purge_after?: string | null;
          sort_order?: number;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          alt_text?: string;
          created_at?: string | null;
          deleted_at?: string | null;
          id?: string;
          hover_image_url?: string | null;
          hover_media_asset_id?: string | null;
          image_url?: string | null;
          media_asset_id?: string | null;
          published?: boolean;
          purge_after?: string | null;
          sort_order?: number;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'standard_items_hover_media_asset_id_fkey';
            columns: ['hover_media_asset_id'];
            isOneToOne: false;
            referencedRelation: 'media_assets';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'standard_items_media_asset_id_fkey';
            columns: ['media_asset_id'];
            isOneToOne: false;
            referencedRelation: 'media_assets';
            referencedColumns: ['id'];
          },
        ];
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
      site_texts: {
        Row: {
          created_at: string | null;
          deleted_at: string | null;
          key: string;
          purge_after: string | null;
          updated_at: string | null;
          value: Json;
        };
        Insert: {
          created_at?: string | null;
          deleted_at?: string | null;
          key: string;
          purge_after?: string | null;
          updated_at?: string | null;
          value: Json;
        };
        Update: {
          created_at?: string | null;
          deleted_at?: string | null;
          key?: string;
          purge_after?: string | null;
          updated_at?: string | null;
          value?: Json;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      soft_delete_portfolio_project: {
        Args: { project_id: string; retention_days?: number };
        Returns: undefined;
      };
      restore_portfolio_project: {
        Args: { project_id: string };
        Returns: undefined;
      };
      soft_delete_faq_item: {
        Args: { item_id: string; retention_days?: number };
        Returns: undefined;
      };
      hard_delete_faq_item: {
        Args: { item_id: string };
        Returns: undefined;
      };
      restore_faq_item: {
        Args: { item_id: string };
        Returns: undefined;
      };
      soft_delete_process_step: {
        Args: { step_id: string; retention_days?: number };
        Returns: undefined;
      };
      hard_delete_process_step: {
        Args: { step_id: string };
        Returns: undefined;
      };
      restore_process_step: {
        Args: { step_id: string };
        Returns: undefined;
      };
      soft_delete_site_text: {
        Args: { text_key: string; retention_days?: number };
        Returns: undefined;
      };
      hard_delete_site_text: {
        Args: { text_key: string };
        Returns: undefined;
      };
      restore_site_text: {
        Args: { text_key: string };
        Returns: undefined;
      };
      soft_delete_portfolio_image_override: {
        Args: { override_project_key: string; override_image_slot: string; retention_days?: number };
        Returns: undefined;
      };
      hard_delete_portfolio_image_override: {
        Args: { override_project_key: string; override_image_slot: string };
        Returns: undefined;
      };
      restore_portfolio_image_override: {
        Args: { override_project_key: string; override_image_slot: string };
        Returns: undefined;
      };
      hard_delete_portfolio_project: {
        Args: { project_id: string };
        Returns: undefined;
      };
      soft_delete_service: {
        Args: { service_id: string; retention_days?: number };
        Returns: undefined;
      };
      restore_service: {
        Args: { service_id: string };
        Returns: undefined;
      };
      hard_delete_service: {
        Args: { service_id: string };
        Returns: undefined;
      };
      soft_delete_standard_item: {
        Args: { item_id: string; retention_days?: number };
        Returns: undefined;
      };
      restore_standard_item: {
        Args: { item_id: string };
        Returns: undefined;
      };
      hard_delete_standard_item: {
        Args: { item_id: string };
        Returns: undefined;
      };
      soft_delete_contact_item: {
        Args: { item_id: string; retention_days?: number };
        Returns: undefined;
      };
      restore_contact_item: {
        Args: { item_id: string };
        Returns: undefined;
      };
      hard_delete_contact_item: {
        Args: { item_id: string };
        Returns: undefined;
      };
      delete_expired_portfolio_projects: {
        Args: Record<PropertyKey, never>;
        Returns: number;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
