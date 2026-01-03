import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Mail, Phone, MapPin, Github, Linkedin, Twitter, MessageSquare, Eye, Trash2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { contactAPI, messagesAPI } from "@/services/api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export const AdminContact = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const [contactData, setContactData] = useState({
    email: "",
    phone: "",
    location: "",
    linkedin_url: "",
    github_url: "",
    twitter_url: "",
    whatsapp_url: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const contactResponse = await contactAPI.get();

      setContactData({
        email: contactResponse.data.email || "",
        phone: contactResponse.data.phone || "",
        location: contactResponse.data.location || "",
        linkedin_url: contactResponse.data.linkedin_url || "",
        github_url: contactResponse.data.github_url || "",
        twitter_url: contactResponse.data.twitter_url || "",
        whatsapp_url: contactResponse.data.whatsapp_url || "",
      });
    } catch (error) {
      toast.error("Failed to fetch contact data");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const response = await messagesAPI.getAll();
      setMessages(response.data);
    } catch (error) {
      toast.error("Failed to fetch messages");
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await contactAPI.update(contactData);
      toast.success("Contact information updated successfully");
    } catch (error) {
      toast.error("Failed to update contact information");
    } finally {
      setSaving(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await messagesAPI.updateStatus(id, "read");
      toast.success("Message marked as read");
      fetchMessages();
    } catch (error) {
      toast.error("Failed to update message status");
    }
  };

  const handleDeleteMessage = async (id: number) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      await messagesAPI.delete(id);
      toast.success("Message deleted successfully");
      fetchMessages();
    } catch (error) {
      toast.error("Failed to delete message");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold">Contact Section</h1>
        <p className="text-muted-foreground">
          Manage contact information, social links, and messages
        </p>
      </div>

      <Tabs defaultValue="info" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="info">Contact Info</TabsTrigger>
          <TabsTrigger value="social">Social Links</TabsTrigger>
          <TabsTrigger value="messages" onClick={fetchMessages}>Messages</TabsTrigger>
        </TabsList>

        {/* Contact Info Tab */}
        <TabsContent value="info">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <form onSubmit={handleSaveContact} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={contactData.email}
                    onChange={(e) =>
                      setContactData({ ...contactData, email: e.target.value })
                    }
                    placeholder="hello@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    value={contactData.phone}
                    onChange={(e) =>
                      setContactData({ ...contactData, phone: e.target.value })
                    }
                    placeholder="+1 234 567 8900"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </Label>
                <Input
                  id="location"
                  value={contactData.location}
                  onChange={(e) =>
                    setContactData({ ...contactData, location: e.target.value })
                  }
                  placeholder="City, Country"
                />
              </div>

              <Button type="submit" disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Contact Info"}
              </Button>
            </form>
          </motion.div>
        </TabsContent>

        {/* Social Links Tab */}
        <TabsContent value="social">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <form onSubmit={handleSaveContact} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="linkedin" className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4" />
                    LinkedIn URL
                  </Label>
                  <Input
                    id="linkedin"
                    type="url"
                    value={contactData.linkedin_url}
                    onChange={(e) =>
                      setContactData({ ...contactData, linkedin_url: e.target.value })
                    }
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>

                <div>
                  <Label htmlFor="github" className="flex items-center gap-2">
                    <Github className="h-4 w-4" />
                    GitHub URL
                  </Label>
                  <Input
                    id="github"
                    type="url"
                    value={contactData.github_url}
                    onChange={(e) =>
                      setContactData({ ...contactData, github_url: e.target.value })
                    }
                    placeholder="https://github.com/yourusername"
                  />
                </div>

                <div>
                  <Label htmlFor="twitter" className="flex items-center gap-2">
                    <Twitter className="h-4 w-4" />
                    Twitter URL
                  </Label>
                  <Input
                    id="twitter"
                    type="url"
                    value={contactData.twitter_url}
                    onChange={(e) =>
                      setContactData({ ...contactData, twitter_url: e.target.value })
                    }
                    placeholder="https://twitter.com/yourusername"
                  />
                </div>

                <div>
                  <Label htmlFor="whatsapp" className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp URL
                  </Label>
                  <Input
                    id="whatsapp"
                    type="url"
                    value={contactData.whatsapp_url}
                    onChange={(e) =>
                      setContactData({ ...contactData, whatsapp_url: e.target.value })
                    }
                    placeholder="https://wa.me/1234567890"
                  />
                </div>
              </div>

              <Button type="submit" disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Social Links"}
              </Button>
            </form>
          </motion.div>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            {loadingMessages ? (
              <div className="text-center py-8">Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No messages yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message: any) => (
                  <div
                    key={message.id}
                    className="border border-border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{message.name}</h3>
                          <Badge variant={message.status === "unread" ? "default" : "secondary"}>
                            {message.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{message.email}</p>
                      </div>
                      <div className="flex gap-2">
                        {message.status === "unread" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMarkAsRead(message.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteMessage(message.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm">{message.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(message.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminContact;
