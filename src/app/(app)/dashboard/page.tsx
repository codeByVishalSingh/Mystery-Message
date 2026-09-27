"use client";

import { Message } from "@/app/models/user.model";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { acceptScehma } from "@/Schemas/acceptMessageSchema";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import MessageCard from "@/components/MessageCard";

const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptScehma),
    defaultValues: {
      acceptMessages: false,
    },
  });

  const { watch, setValue } = form;

  const acceptMessages = watch("acceptMessages");

  // Delete message from UI
  const handleDeleteMessage = (messageId: string) => {
    setMessages((prevMessages) =>
      prevMessages.filter(
        (message) => String(message._id) !== messageId
      )
    );
  };

  // Fetch accept message setting
  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);

    try {
      const response = await axios.get("/api/accept-messages");

      setValue("acceptMessages", response.data.isAccept);
    } catch (error) {
      console.log(error);

      toast.error("Failed to fetch message settings");
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  // Fetch messages
  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);

      try {
        const response = await axios.get("/api/get-messages");

        setMessages(response.data.messages || []);

        if (refresh) {
          toast.success("Refreshed Messages", {
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        console.log(error);

        toast.error("Failed to fetch messages");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Fetch data when session is available
  useEffect(() => {
    if (!session?.user) return;

    fetchMessages();
    fetchAcceptMessage();
  }, [session, fetchMessages, fetchAcceptMessage]);

  // Switch change
  const handleSwitchChange = async () => {
    const newValue = !acceptMessages;

    setIsSwitchLoading(true);

    try {
      const response = await axios.post("/api/accept-messages", {
        acceptMessages: newValue,
      });

      setValue("acceptMessages", newValue);

      toast.success(response.data.message);
    } catch (error) {
      console.log(error);

      toast.error("Failed to update message settings");
    } finally {
      setIsSwitchLoading(false);
    }
  };

  // Login check
  if (!session?.user) {
    return <div>Please Login First</div>;
  }

  // Get username
  const { username } = session.user as User & {
    username: string;
  };

  // Profile URL
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "";

  const profileUrl = `${baseUrl}/u/${username}`;

  // Copy profile URL
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);

      toast.success("URL copied", {
        description: "Profile URL has been copied to clipboard",
      });
    } catch (error) {
      console.log(error);

      toast.error("Failed to copy URL");
    }
  };

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      
      <h1 className="text-4xl font-bold mb-4">
        User Dashboard
      </h1>

      {/* Profile URL */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">
          Copy Your Unique Link
        </h2>

        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />

          <Button onClick={copyToClipboard}>
            Copy
          </Button>
        </div>
      </div>

      {/* Accept Messages */}
      <div className="mb-4 flex items-center">
        <Switch
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />

        <span className="ml-2">
          Accept Messages:{" "}
          {acceptMessages ? "On" : "Off"}
        </span>
      </div>

      <Separator />

      {/* Refresh Messages */}
      <Button
        className="mt-4"
        variant="outline"
        onClick={() => fetchMessages(true)}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>

      {/* Messages */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={String(message._id)}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;