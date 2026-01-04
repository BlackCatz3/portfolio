import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Key, User, Shield, Mail, Clock, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authAPI, rateLimitSettingsAPI } from "@/services/api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

export const AdminSettings = () => {
  const [saving, setSaving] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [rateLimitSettings, setRateLimitSettings] = useState({
    max_messages_per_email: 3,
    time_window_minutes: 60,
    enabled: true,
  });
  const [loadingRateLimit, setLoadingRateLimit] = useState(true);

  // Load rate limit settings
  useEffect(() => {
    const fetchRateLimitSettings = async () => {
      try {
        const response = await rateLimitSettingsAPI.get();
        setRateLimitSettings(response.data);
      } catch (error) {
        console.error('Error fetching rate limit settings:', error);
        toast.error('Failed to load rate limit settings');
      } finally {
        setLoadingRateLimit(false);
      }
    };

    fetchRateLimitSettings();
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setSaving(true);
    try {
      await authAPI.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      toast.success("Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateRateLimitSettings = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rateLimitSettings.max_messages_per_email < 1 || rateLimitSettings.max_messages_per_email > 100) {
      toast.error("Max messages must be between 1 and 100");
      return;
    }

    if (rateLimitSettings.time_window_minutes < 1 || rateLimitSettings.time_window_minutes > 1440) {
      toast.error("Time window must be between 1 and 1440 minutes (24 hours)");
      return;
    }

    setSaving(true);
    try {
      const response = await rateLimitSettingsAPI.update(rateLimitSettings);
      setRateLimitSettings(response.data);
      toast.success("Rate limit settings updated successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  const adminEmail = localStorage.getItem("admin")
    ? JSON.parse(localStorage.getItem("admin")!).email
    : "admin@4leafclover.id";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="rate-limit">Rate Limiting</TabsTrigger>
        </TabsList>

        {/* Account Tab */}
        <TabsContent value="account">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Admin Account</h3>
                  <p className="text-sm text-muted-foreground">{adminEmail}</p>
                </div>
              </div>

              <div className="bg-muted/50 border border-border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Account Information</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      You are logged in as an administrator. You have full access to manage all content on your portfolio.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Key className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Change Password</h3>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    required
                    placeholder="Enter your current password"
                  />
                </div>

                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    required
                    placeholder="Enter new password (min 6 characters)"
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                    placeholder="Confirm your new password"
                  />
                </div>

                <div className="bg-muted/50 border border-border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">
                    💡 <strong>Password Requirements:</strong>
                  </p>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1 ml-4">
                    <li>• Minimum 6 characters</li>
                    <li>• Use a strong, unique password</li>
                    <li>• Don't reuse passwords from other sites</li>
                  </ul>
                </div>

                <Button type="submit" disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Changing..." : "Change Password"}
                </Button>
              </form>
            </div>
          </motion.div>
        </TabsContent>

        {/* Rate Limiting Tab */}
        <TabsContent value="rate-limit">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            {loadingRateLimit ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <form onSubmit={handleUpdateRateLimitSettings} className="space-y-6">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Email Rate Limiting</h3>
                </div>

                <div className="bg-muted/50 border border-border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">
                    Control how many messages can be sent from the same email address within a specific time window. This helps prevent spam and abuse.
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    {rateLimitSettings.enabled ? (
                      <ToggleRight className="h-5 w-5 text-primary" />
                    ) : (
                      <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div>
                      <p className="font-medium">Enable Email Rate Limiting</p>
                      <p className="text-sm text-muted-foreground">
                        {rateLimitSettings.enabled ? "Rate limiting is active" : "Rate limiting is disabled"}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={rateLimitSettings.enabled}
                    onCheckedChange={(checked) =>
                      setRateLimitSettings({ ...rateLimitSettings, enabled: checked })
                    }
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="maxMessages">Max Messages per Email</Label>
                    <Input
                      id="maxMessages"
                      type="number"
                      min="1"
                      max="100"
                      value={rateLimitSettings.max_messages_per_email}
                      onChange={(e) =>
                        setRateLimitSettings({
                          ...rateLimitSettings,
                          max_messages_per_email: parseInt(e.target.value) || 1,
                        })
                      }
                      required
                      disabled={!rateLimitSettings.enabled}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Maximum number of messages allowed (1-100)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="timeWindow">
                      <Clock className="h-4 w-4 inline mr-1" />
                      Time Window (minutes)
                    </Label>
                    <Input
                      id="timeWindow"
                      type="number"
                      min="1"
                      max="1440"
                      value={rateLimitSettings.time_window_minutes}
                      onChange={(e) =>
                        setRateLimitSettings({
                          ...rateLimitSettings,
                          time_window_minutes: parseInt(e.target.value) || 1,
                        })
                      }
                      required
                      disabled={!rateLimitSettings.enabled}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Time window in minutes (1-1440)
                    </p>
                  </div>
                </div>

                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <p className="text-sm font-medium text-primary mb-2">Current Settings:</p>
                  <p className="text-sm text-muted-foreground">
                    {rateLimitSettings.enabled ? (
                      <>
                        Users can send up to <strong>{rateLimitSettings.max_messages_per_email} messages</strong> per{" "}
                        <strong>{rateLimitSettings.time_window_minutes} minutes</strong> from the same email address.
                      </>
                    ) : (
                      "Email rate limiting is currently disabled."
                    )}
                  </p>
                </div>

                <div className="bg-muted/50 border border-border rounded-lg p-4">
                  <p className="text-sm font-medium mb-2">💡 Recommended Settings:</p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• <strong>Strict:</strong> 3 messages per 60 minutes</li>
                    <li>• <strong>Moderate:</strong> 5 messages per 120 minutes</li>
                    <li>• <strong>Lenient:</strong> 10 messages per 240 minutes</li>
                  </ul>
                </div>

                <Button type="submit" disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : "Save Settings"}
                </Button>
              </form>
            )}
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
