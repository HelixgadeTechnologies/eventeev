"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Button from "@/components/ui/Button";
import InputComponent from "@/components/ui/EmailInput";
import Link from "next/link";
import Modal from "@/components/ui/Modal";

export default function OrganizationRegistrationForm() {
  const [userData, setUserData] = useState({
    orgName: "",
    orgWebsite: "",
    orgIndustry: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  //   change to MouseEvent<HTMLButtonElement> later or any that properly submits forms
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
    // window.open("https://mail.google.com", "_blank");
  };

  const handleModalClose = () => setIsModalOpen(false);
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
        <form
          action=""
          className="space-y-2.5 md:space-y-5"
          onSubmit={handleSubmit}
        >
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
            placeholder=""
          />
          <InputComponent
            name="orgIndustry"
            label="Organization Industry"
            value={userData.orgIndustry}
            onChange={handleInputChange}
            placeholder=""
          />
          <div className="mt-5">
            <Button content="Proceed" />
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
        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          header="Verify your email"
          message="We sent a mail to your email address, click on the link to verify your account"
          buttonContent="Open email"
        />
      )}
    </>
  );
}
