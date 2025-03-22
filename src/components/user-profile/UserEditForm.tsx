"use client";
import { userAtom } from "@/atoms/UserAtoms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtomValue } from "jotai";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useModal } from "../../hooks/useModal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";

// Zod validation schema
const formSchema = z.object({
  social: z.object({
    facebook: z.string().url().optional().or(z.literal('')),
    x: z.string().url().optional().or(z.literal('')),
    linkedin: z.string().url().optional().or(z.literal('')),
    instagram: z.string().url().optional().or(z.literal('')),
  }),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  bio: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function UserMetaCard() {
  const { isOpen,closeModal } = useModal();
  const user = useAtomValue(userAtom);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      social: {
        facebook: "https://www.facebook.com/PimjoHQ",
        x: "https://x.com/PimjoHQ",
        linkedin: "https://www.linkedin.com/company/pimjo",
        instagram: "https://instagram.com/PimjoHQ",
      },
    },
  });

  const handleSave = (data: FormValues) => {
    console.log("Saving changes:", data);
    closeModal();
  };

  return (
    <>
      {/* Existing profile card UI remains exactly the same */}

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Personal Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>
          <form onSubmit={handleSubmit(handleSave)}>
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div>
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Social Links
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Label>Facebook</Label>
                    <Input
                      {...register("social.facebook")}
                      error={!!errors.social?.facebook}
                      hint={errors.social?.facebook?.message}
                    />
                  </div>

                  <div>
                    <Label>X.com</Label>
                    <Input
                      {...register("social.x")}
                      error={!!errors.social?.x}
                      hint={errors.social?.x?.message}
                    />
                  </div>

                  <div>
                    <Label>Linkedin</Label>
                    <Input
                      {...register("social.linkedin")}
                      error={!!errors.social?.linkedin}
                      hint={errors.social?.linkedin?.message}
                    />
                  </div>

                  <div>
                    <Label>Instagram</Label>
                    <Input
                      {...register("social.instagram")}
                      error={!!errors.social?.instagram}
                      hint={errors.social?.instagram?.message}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Personal Information
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>First Name</Label>
                    <Input
                      {...register("firstName")}
                      error={!!errors.firstName}
                      hint={errors.firstName?.message}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Last Name</Label>
                    <Input
                      {...register("lastName")}
                      error={!!errors.lastName}
                      hint={errors.lastName?.message}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Email Address</Label>
                    <Input
                      {...register("email")}
                      type="email"
                      error={!!errors.email}
                      hint={errors.email?.message}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Phone</Label>
                    <Input
                      {...register("phone")}
                      type="tel"
                      error={!!errors.phone}
                      hint={errors.phone?.message}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  closeModal();
                  reset();
                }}
                type="button"
              >
                Close
              </Button>
              <Button size="sm" type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}