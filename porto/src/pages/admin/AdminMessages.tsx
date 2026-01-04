import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Trash2, Eye, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { messagesAPI } from "@/services/api";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await messagesAPI.getAll();
      setMessages(response.data);
    } catch (error) {
      toast.error("Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  const handleViewMessage = async (message) => {
    setSelectedMessage(message);
    setViewDialogOpen(true);
    
    // Mark as read
    if (message.status === 'unread') {
      try {
        await messagesAPI.updateStatus(message.id, 'read');
        fetchMessages();
      } catch (error) {
        // Silently fail - status update is not critical
      }
    }
  };

  const handleDelete = async () => {
    try {
      await messagesAPI.delete(selectedMessage.id);
      toast.success("Message deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedMessage(null);
      fetchMessages();
    } catch (error) {
      toast.error("Failed to delete message");
    }
  };

  const unreadCount = messages.filter((m) => m.status === 'unread').length;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold">Messages Inbox</h1>
        <p className="text-muted-foreground">
          View and manage contact form submissions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Total Messages</h3>
          </div>
          <p className="text-3xl font-bold mt-2">{messages.length}</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold">Unread</h3>
          </div>
          <p className="text-3xl font-bold mt-2">{unreadCount}</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <h3 className="font-semibold">Read</h3>
          </div>
          <p className="text-3xl font-bold mt-2">{messages.length - unreadCount}</p>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-2">
        {messages.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-lg">
            <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No messages yet</p>
          </div>
        ) : (
          messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-card border rounded-lg p-4 flex items-center justify-between hover:bg-accent/50 transition-colors ${
                message.status === 'unread' ? 'border-primary' : 'border-border'
              }`}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={`p-2 rounded-full ${
                  message.status === 'unread' ? 'bg-primary/20' : 'bg-muted'
                }`}>
                  <Mail className={`h-5 w-5 ${
                    message.status === 'unread' ? 'text-primary' : 'text-muted-foreground'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold truncate">{message.name}</p>
                    {message.status === 'unread' && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{message.email}</p>
                  {message.subject && (
                    <p className="text-sm font-medium mt-1 truncate">{message.subject}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(message.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleViewMessage(message)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    setSelectedMessage(message);
                    setDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* View Message Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">From</p>
                <p className="font-semibold">{selectedMessage.name}</p>
                <p className="text-sm text-muted-foreground">{selectedMessage.email}</p>
              </div>
              {selectedMessage.subject && (
                <div>
                  <p className="text-sm text-muted-foreground">Subject</p>
                  <p className="font-semibold">{selectedMessage.subject}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Message</p>
                <div className="mt-2 p-4 bg-muted rounded-lg">
                  <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Received</p>
                <p>{new Date(selectedMessage.created_at).toLocaleString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the message from "{selectedMessage?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminMessages;
