"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Settings,
  Database,
  Bell,
  Users,
  Shield,
  Plus,
  Trash2,
  Mail,
  Check,
  Key,
  RefreshCw,
  Calendar,
  Clock,
} from "lucide-react";

const mockAdmins = [
  { id: "1", name: "Sarah Chen", email: "sarah.chen@company.com", role: "Super Admin", avatar: "SC" },
  { id: "2", name: "Mike Johnson", email: "mike.j@company.com", role: "HR Admin", avatar: "MJ" },
  { id: "3", name: "Lisa Park", email: "lisa.p@company.com", role: "HR Admin", avatar: "LP" },
];

export function HRSettings() {
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("hr_admin");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Configure system settings and manage admin access
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-none lg:inline-flex">
          <TabsTrigger value="general" className="gap-2">
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2">
            <Database className="h-4 w-4" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="admins" className="gap-2">
            <Users className="h-4 w-4" />
            Admin Users
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">System Configuration</CardTitle>
              <CardDescription>Configure general system behavior and defaults</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-approve Low-risk Benefits</p>
                  <p className="text-sm text-muted-foreground">
                    Automatically approve benefits that dont require contracts
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Require Justification for Overrides</p>
                  <p className="text-sm text-muted-foreground">
                    Admins must provide a reason when overriding eligibility
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Grace Period for Late Arrivals</p>
                  <p className="text-sm text-muted-foreground">
                    Number of days before late arrivals affect eligibility
                  </p>
                </div>
                <Select defaultValue="0">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Immediate</SelectItem>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="14">14 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Default Subsidy Percent</p>
                  <p className="text-sm text-muted-foreground">
                    Default subsidy percentage for new benefits
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Input type="number" defaultValue="50" className="w-20" />
                  <span className="text-muted-foreground">%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Audit & Compliance</CardTitle>
              <CardDescription>Configure audit log retention and compliance settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Audit Log Retention</p>
                  <p className="text-sm text-muted-foreground">
                    How long to keep audit log entries
                  </p>
                </div>
                <Select defaultValue="365">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">180 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                    <SelectItem value="730">2 years</SelectItem>
                    <SelectItem value="forever">Forever</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Log IP Addresses</p>
                  <p className="text-sm text-muted-foreground">
                    Track IP addresses for all admin actions
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">OKR Integration</CardTitle>
              <CardDescription>Configure connection to your OKR tracking system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Database className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">OKR System</p>
                    <p className="text-sm text-muted-foreground">Connected to internal OKR API</p>
                  </div>
                </div>
                <Badge className="bg-success text-success-foreground">
                  <Check className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              </div>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>API Endpoint</Label>
                  <Input defaultValue="https://api.company.com/okr" />
                </div>
                <div className="space-y-2">
                  <Label>Sync Frequency</Label>
                  <Select defaultValue="hourly">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Sync Now
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Key className="h-4 w-4" />
                  Update API Key
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Attendance Data Import</CardTitle>
              <CardDescription>Configure how attendance data is imported into EBMS</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                    <Clock className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="font-medium">Attendance System</p>
                    <p className="text-sm text-muted-foreground">Manual CSV import enabled</p>
                  </div>
                </div>
                <Badge variant="outline">Manual</Badge>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Import Method</Label>
                <Select defaultValue="csv">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV Upload</SelectItem>
                    <SelectItem value="api">API Integration</SelectItem>
                    <SelectItem value="sftp">SFTP Sync</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" className="gap-2">
                <Calendar className="h-4 w-4" />
                Upload Attendance CSV
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Preferences */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Email Notifications</CardTitle>
              <CardDescription>Configure when to receive email alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">New Benefit Requests</p>
                  <p className="text-sm text-muted-foreground">
                    Email when employees submit benefit requests
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Contract Expiration Warnings</p>
                  <p className="text-sm text-muted-foreground">
                    Email 30 days before vendor contracts expire
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Attendance Violations</p>
                  <p className="text-sm text-muted-foreground">
                    Email when employees exceed late arrival thresholds
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Weekly Summary Digest</p>
                  <p className="text-sm text-muted-foreground">
                    Receive a weekly summary of system activity
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">In-App Notifications</CardTitle>
              <CardDescription>Configure dashboard notification settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show Badge Counts</p>
                  <p className="text-sm text-muted-foreground">
                    Display unread count badges in the sidebar
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-dismiss Success Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Automatically hide success messages after 5 seconds
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Admin Users */}
        <TabsContent value="admins" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Admin Users</CardTitle>
                <CardDescription>Manage who has access to the HR admin panel</CardDescription>
              </div>
              <Button className="gap-2" onClick={() => setInviteModalOpen(true)}>
                <Plus className="h-4 w-4" />
                Invite Admin
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAdmins.map((admin) => (
                  <div
                    key={admin.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {admin.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{admin.name}</p>
                        <p className="text-sm text-muted-foreground">{admin.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={admin.role === "Super Admin" ? "default" : "secondary"}
                      >
                        <Shield className="h-3 w-3 mr-1" />
                        {admin.role}
                      </Badge>
                      {admin.role !== "Super Admin" && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Role Permissions</CardTitle>
              <CardDescription>Overview of what each admin role can do</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge>Super Admin</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Full access to all features including system settings, admin management, and audit log deletion.
                  </p>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">HR Admin</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Can manage employees, approve requests, configure benefits and rules. Cannot manage other admins or system settings.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Invite Admin Modal */}
      <Dialog open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Admin User</DialogTitle>
            <DialogDescription>
              Send an invitation to grant admin access to the HR panel
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email Address</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invite-role">Role</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hr_admin">HR Admin</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button className="gap-2" onClick={() => setInviteModalOpen(false)}>
              <Mail className="h-4 w-4" />
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
