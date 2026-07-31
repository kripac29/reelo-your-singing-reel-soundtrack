import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const API_BASE_URL = "http://https://reelo-your-singing-reel-soundtrack.onrender.com/api";

export const Route = createFileRoute("/app/settings")({ component: Settings });

function Settings() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const initial = user?.name?.trim().charAt(0).toUpperCase() || "?";

  const authHeaders = () => {
    const token = window.localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate({ to: "/login" });
    } catch {
      navigate({ to: "/login" });
    }
  };

  const handlePasswordChange = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSavingPassword(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: "POST",
        headers: authHeaders(),
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.message || "Unable to change password");

      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsPasswordDialogOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to change password");
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/account`, {
        method: "DELETE",
        headers: authHeaders(),
        credentials: "include",
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.message || "Unable to delete account");

      await logout();
      navigate({ to: "/login" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete account");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8">
      <header>
        <h1 className="font-display text-3xl md:text-4xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your Reelo account.</p>
      </header>

      <section className="glass rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-full gradient-brand text-2xl font-bold">
            {initial}
          </div>
          <div className="min-w-0">
            <div className="truncate font-semibold">{user?.name}</div>
            <div className="truncate text-sm text-muted-foreground">{user?.email}</div>
          </div>
        </div>
      </section>

      <section className="glass space-y-4 rounded-2xl p-6">
        <h2 className="font-display text-lg font-semibold">Account</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => setIsPasswordDialogOpen(true)}>
            Change password
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
          <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
            Delete account
          </Button>
        </div>
      </section>

      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new password with at least 8 characters.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handlePasswordChange}>
            <PasswordField
              label="Current password"
              value={currentPassword}
              onChange={setCurrentPassword}
              autoComplete="current-password"
            />
            <PasswordField
              label="New password"
              value={newPassword}
              onChange={setNewPassword}
              autoComplete="new-password"
              minLength={8}
            />
            <PasswordField
              label="Confirm new password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              autoComplete="new-password"
              minLength={8}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPasswordDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSavingPassword}>
                {isSavingPassword ? "Saving..." : "Save password"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete your account?</DialogTitle>
            <DialogDescription>
              This will permanently delete your account and your Reelo data. This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  autoComplete,
  minLength,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  minLength?: number;
}) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <input
        required
        minLength={minLength}
        type="password"
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-primary"
      />
    </label>
  );
}
