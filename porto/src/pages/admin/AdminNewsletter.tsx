import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trash2, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { newsletterAPI } from "@/services/api";
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

export const AdminNewsletter = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const response = await newsletterAPI.getSubscribers();
      setSubscribers(response.data);
    } catch (error) {
      toast.error("Failed to fetch subscribers");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await newsletterAPI.deleteSubscriber(selectedSubscriber.id);
      toast.success("Subscriber deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedSubscriber(null);
      fetchSubscribers();
    } catch (error) {
      toast.error("Failed to delete subscriber");
    }
  };

  const activeSubscribers = subscribers.filter((s) => s.status === "active");
  const unsubscribed = subscribers.filter((s) => s.status === "unsubscribed");

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold">
          Newsletter Management
        </h1>
        <p className="text-muted-foreground">
          Manage your newsletter subscribers
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Total Subscribers</h3>
          </div>
          <p className="text-3xl font-bold mt-2">{subscribers.length}</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-green-500" />
            <h3 className="font-semibold">Active</h3>
          </div>
          <p className="text-3xl font-bold mt-2">{activeSubscribers.length}</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">Unsubscribed</h3>
          </div>
          <p className="text-3xl font-bold mt-2">{unsubscribed.length}</p>
        </div>
      </div>

      {/* Subscribers List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Active Subscribers</h2>
        {activeSubscribers.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-lg">
            <p className="text-muted-foreground">No active subscribers yet</p>
          </div>
        ) : (
          <div className="grid gap-2">
            {activeSubscribers.map((subscriber) => (
              <motion.div
                key={subscriber.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{subscriber.email}</p>
                    {subscriber.name && (
                      <p className="text-sm text-muted-foreground">
                        {subscriber.name}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3" />
                      Subscribed:{" "}
                      {new Date(subscriber.subscribed_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    setSelectedSubscriber(subscriber);
                    setDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the subscriber "
              {selectedSubscriber?.email}". This action cannot be undone.
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

export default AdminNewsletter;
