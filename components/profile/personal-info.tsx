"use client";

import { useState } from "react";
import { User as UserIcon, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserProfile } from "@/lib/types";
import { INDIAN_CITIES } from "@/lib/constants";

interface PersonalInfoProps {
  user: UserProfile;
  isSaving: boolean;
  onSave: (updates: Partial<UserProfile>) => Promise<void>;
}

export function PersonalInfo({ user, isSaving, onSave }: PersonalInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<UserProfile>>(user);

  const handleSave = async () => {
    await onSave(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(user);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* User Details */}
      <Card className="p-6 bg-card border-border space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-primary" />
            User Details
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
          <div>
            <label className="text-sm text-muted-foreground">Full Name</label>
            {isEditing ? (
              <input
                type="text"
                value={editData.fullName || ""}
                onChange={(e) =>
                  setEditData({ ...editData, fullName: e.target.value })
                }
                className="w-full mt-1 px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            ) : (
              <p className="text-foreground font-semibold">{user.fullName}</p>
            )}
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Email Address</label>
            <p className="text-foreground font-semibold">{user.email}</p>
            {isEditing && (
              <p className="text-[10px] text-muted-foreground mt-1">
                Email cannot be changed
              </p>
            )}
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Phone Number</label>
            {isEditing ? (
              <input
                type="text"
                value={editData.phone || ""}
                onChange={(e) =>
                  setEditData({ ...editData, phone: e.target.value })
                }
                className="w-full mt-1 px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            ) : (
              <p className="text-foreground font-semibold">
                {user.phone || "Not provided"}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm text-muted-foreground">License Number</label>
            {isEditing ? (
              <input
                type="text"
                value={editData.licenseNumber || ""}
                onChange={(e) =>
                  setEditData({ ...editData, licenseNumber: e.target.value })
                }
                className="w-full mt-1 px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            ) : (
              <p className="text-foreground font-semibold">
                {user.licenseNumber || "Not provided"}
              </p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-muted-foreground">Current Address</label>
            {isEditing ? (
              <div className="space-y-2 mt-1">
                <input
                  type="text"
                  placeholder="Street Address"
                  value={editData.address || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, address: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <select
                  value={editData.city || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, city: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="" disabled>Select your city</option>
                  {INDIAN_CITIES.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            ) : (
              <p className="text-foreground font-semibold mt-1">
                {user.address || "Not provided"}{" "}
                {user.city ? `, ${user.city}` : ""}
              </p>
            )}
          </div>
        </div>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Edit Information
          </Button>
        )}
      </Card>

      {/* Save/Cancel Buttons */}
      {isEditing && (
        <div className="flex gap-4">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-6 shadow-lg transition-all active:scale-95"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            onClick={handleCancel}
            disabled={isSaving}
            variant="outline"
            className="flex-1 border-border text-foreground py-6 font-bold hover:bg-secondary"
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
