"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Button from "@/components/ui/Button";
import InputComponent from "@/components/ui/EmailInput";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";
import axiosInstance from "@/lib/axios";

export default function OrganizationRegistrationForm() {
  const router = useRouter();
  const [userData, setUserData] = useState({
    orgName: "",
    orgWebsite: "",
    orgIndustry: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Map frontend fields to backend PUT /api/auth/organisation payload
      const payload = {
        orgName: userData.orgName,
        orgWebsite: userData.orgWebsite,
        orgIndustry: userData.orgIndustry,
      };

      await axiosInstance.put("/api/auth/organisation", payload);
      setIsModalOpen(true);
    } catch (err: any) {
      console.error("Failed to save organization details:", err);
      setError(
        err.response?.data?.message || "Failed to save organization details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    router.push("/events"); // Redirect to events instead of home
  };

  return (
    <>
      <div className="space-y-2 w-full md:w-[480px] m-4">
        <div className="mb-10 space-y-2">
          <h2 className="text-3xl md:text-4xl text-center md:text-start font-semibold text-[#1B1818]">
            Organization Details
          </h2>
          <p className="text-sm text-black/70 text-center md:text-start">
            Please tell us about your organisation
          </p>
        </div>
        <form className="space-y-2.5 md:space-y-5" onSubmit={handleSubmit}>
          <InputComponent
            name="orgName"
            label="Organization Name"
            value={userData.orgName}
            onChange={handleInputChange}
            placeholder=""
          />
          <InputComponent
            name="orgWebsite"
            label="Organization Website"
            value={userData.orgWebsite}
            onChange={handleInputChange}
            type="url"
            placeholder="https://example.com"
          />
          <InputComponent
            name="orgIndustry"
            label="Organization Industry"
            value={userData.orgIndustry}
            onChange={handleInputChange}
            placeholder=""
          />
          
          {error && (
            <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>
          )}

          <div className="mt-5">
            <Button 
              content={loading ? "Saving..." : "Proceed"} 
              type="submit"
              disabled={loading}
            />
          </div>
        </form>
        <section className="space-y-5 mt-5 mb-3">
          <p className="text-center text-sm text-black leading-6 space-x-1">
            <span>Back to</span>
            <Link
              href="/sign-up"
              className="text-[#eb5017] custom-underline font-semibold"
            >
              Registration
            </Link>
          </p>
        </section>
      </div>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={handleModalClose}>
          <h2 className="text-xl font-semibold mb-2 text-center text-[#1B1818]">
            Welcome to Eventeev!
          </h2>
          <p className="text-sm text-center text-black/70">
            Your organization details have been saved successfully. You're all set to start creating amazing events!
          </p>
          <div className="mt-6 flex justify-center">
            <Button onClick={handleModalClose} content="Get Started" />
          </div>
        </Modal>
      )}
    </>
  );
}
