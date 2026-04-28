import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { PageHeader } from "@/shared/components/page-header"
import { ProfileSettings } from "../components/settings/profile-settings"
import { ClinicSettings } from "../components/settings/clinic-settings"
import { BillingSettings } from "../components/settings/billing-settings"

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <div className="flex flex-col h-full w-full px-8 py-10 gap-8">
      <PageHeader
        title="Settings"
        description="Manage your profile, clinic, and billing settings."
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="clinic">Clinic</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <h2 className="text-base font-semibold mb-1">Profile</h2>
          <p className="text-sm text-muted-foreground mb-5">Update your personal information.</p>
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="clinic">
          <h2 className="text-base font-semibold mb-1">Clinic</h2>
          <p className="text-sm text-muted-foreground mb-5">Manage your clinic details and address.</p>
          <ClinicSettings />
        </TabsContent>

        <TabsContent value="billing">
          <h2 className="text-base font-semibold mb-1">Billing</h2>
          <p className="text-sm text-muted-foreground mb-5">View your plan, payment method, and invoice history.</p>
          <BillingSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
