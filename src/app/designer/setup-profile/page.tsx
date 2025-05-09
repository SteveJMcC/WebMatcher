import { DesignerProfileForm } from "@/components/forms/designer-profile-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Setup Designer Profile - WebConnect",
  description: "Create or update your designer profile to showcase your skills and attract clients on WebConnect.",
};

export default function SetupDesignerProfilePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <DesignerProfileForm />
    </div>
  );
}
