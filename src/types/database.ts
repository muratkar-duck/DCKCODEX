export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Roles = "writer" | "producer";
export type ApplicationStatus = "pending" | "accepted" | "rejected";
export type NotificationStatus = "pending" | "processing" | "sent" | "failed";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: Roles;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          role?: Roles;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["users"]["Row"]>;
        Relationships: [];
      };
      scripts: {
        Row: {
          id: string;
          owner_id: string;
          title: string;
          genre: string;
          length: number | null;
          synopsis: string;
          description: string;
          price_cents: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          title: string;
          genre: string;
          length?: number | null;
          synopsis: string;
          description: string;
          price_cents: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["scripts"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "scripts_owner_id_fkey";
            columns: ["owner_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      producer_listings: {
        Row: {
          id: string;
          owner_id: string;
          title: string;
          description: string;
          genre: string;
          budget_cents: number;
          deadline: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          title: string;
          description: string;
          genre: string;
          budget_cents: number;
          deadline?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["producer_listings"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "producer_listings_owner_id_fkey";
            columns: ["owner_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      requests: {
        Row: {
          id: string;
          title: string;
          description: string;
          genre: string | null;
          budget_cents: number | null;
          deadline: string | null;
          producer_id: string | null;
          user_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          genre?: string | null;
          budget_cents?: number | null;
          deadline?: string | null;
          producer_id?: string | null;
          user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["requests"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "requests_producer_id_fkey";
            columns: ["producer_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "requests_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      applications: {
        Row: {
          id: string;
          request_id: string | null;
          listing_id: string | null;
          producer_listing_id: string | null;
          writer_id: string;
          script_id: string | null;
          producer_id: string | null;
          owner_id: string;
          status: ApplicationStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          request_id?: string | null;
          listing_id?: string | null;
          producer_listing_id?: string | null;
          writer_id: string;
          script_id?: string | null;
          producer_id?: string | null;
          owner_id: string;
          status?: ApplicationStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["applications"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "applications_writer_id_fkey";
            columns: ["writer_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "applications_producer_id_fkey";
            columns: ["producer_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "applications_script_id_fkey";
            columns: ["script_id"];
            referencedRelation: "scripts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "applications_request_id_fkey";
            columns: ["request_id"];
            referencedRelation: "requests";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "applications_listing_id_fkey";
            columns: ["listing_id"];
            referencedRelation: "producer_listings";
            referencedColumns: ["id"];
          }
        ];
      };
      orders: {
        Row: {
          id: string;
          script_id: string;
          buyer_id: string;
          amount_cents: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          script_id: string;
          buyer_id: string;
          amount_cents: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "orders_script_id_fkey";
            columns: ["script_id"];
            referencedRelation: "scripts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "orders_buyer_id_fkey";
            columns: ["buyer_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      interests: {
        Row: {
          producer_id: string;
          script_id: string;
          created_at: string;
        };
        Insert: {
          producer_id: string;
          script_id: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["interests"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "interests_producer_id_fkey";
            columns: ["producer_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "interests_script_id_fkey";
            columns: ["script_id"];
            referencedRelation: "scripts";
            referencedColumns: ["id"];
          }
        ];
      };
      notification_queue: {
        Row: {
          id: string;
          recipient_id: string;
          template: string;
          payload: Json | null;
          status: NotificationStatus;
          error: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          recipient_id: string;
          template: string;
          payload?: Json | null;
          status?: NotificationStatus;
          error?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["notification_queue"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "notification_queue_recipient_id_fkey";
            columns: ["recipient_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      conversations: {
        Row: {
          id: string;
          application_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["conversations"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "conversations_application_id_fkey";
            columns: ["application_id"];
            referencedRelation: "applications";
            referencedColumns: ["id"];
          }
        ];
      };
      conversation_participants: {
        Row: {
          id: string;
          conversation_id: string;
          participant_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          participant_id: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["conversation_participants"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey";
            columns: ["conversation_id"];
            referencedRelation: "conversations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "conversation_participants_participant_id_fkey";
            columns: ["participant_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          body: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          body: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["messages"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey";
            columns: ["conversation_id"];
            referencedRelation: "conversations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "messages_sender_id_fkey";
            columns: ["sender_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      support_messages: {
        Row: {
          id: string;
          email: string;
          name: string;
          subject: string;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          subject: string;
          message: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["support_messages"]["Row"]>;
        Relationships: [];
      };
    };
    Views: {
      v_listings_unified: {
        Row: {
          id: string;
          owner_id: string;
          title: string;
          description: string;
          genre: string | null;
          budget_cents: number | null;
          price_cents: number | null;
          type: "listing" | "request";
          created_at: string;
          deadline: string | null;
        };
      };
    };
    Functions: {
      enqueue_notification: {
        Args: {
          recipient_id: string;
          template: string;
          payload?: Json;
        };
        Returns: Database["public"]["Tables"]["notification_queue"]["Row"];
      };
      get_producer_applications: {
        Args: {
          producer_id: string;
        };
        Returns: Database["public"]["Tables"]["applications"]["Row"][];
      };
      rpc_mark_interest: {
        Args: {
          script_id: string;
        };
        Returns: Database["public"]["Tables"]["interests"]["Row"];
      };
      ensure_conversation_with_participants: {
        Args: {
          application_id: string;
          acting_user_id: string;
        };
        Returns: Database["public"]["Tables"]["conversations"]["Row"];
      };
    };
    Enums: {
      application_status: ApplicationStatus;
      notification_status: NotificationStatus;
      role: Roles;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];
