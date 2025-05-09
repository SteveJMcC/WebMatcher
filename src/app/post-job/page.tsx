import { JobPostingForm } from "@/components/forms/job-posting-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Post a Job - WebConnect",
  description: "Submit your project details and find skilled web designers on WebConnect.",
};

export default function PostJobPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <JobPostingForm />
    </div>
  );
}
