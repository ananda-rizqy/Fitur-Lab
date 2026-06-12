import React from "react";
import { Card, CardContent } from "../ui/card";
import { SectionHeader } from "../atoms/SectionHeader";
import { ProfileAvatar } from "../molecules/ProfileAvatar";
import { InfoField } from "../molecules/InfoField";
import { User, Mail, Hash } from "lucide-react";

interface ProfileDetailSectionProps {
  name: string;
  email: string;
  nimNip: string;
  avatar?: string;
}

export function ProfileDetailSection({
  name,
  email,
  nimNip,
  avatar,
}: ProfileDetailSectionProps) {
  return (
    <section className="space-y-3">
      <SectionHeader title="Detail Profil Akun" icon={<User size={15} />} />

      <Card className="border border-zinc-200 dark:border-zinc-800 shadow-xs bg-white dark:bg-zinc-950/20 rounded-[2rem] overflow-hidden">
        <CardContent className="p-6 lg:p-8">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <ProfileAvatar src={avatar} name={name} />

            <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
              <InfoField
                label="Nama Lengkap"
                value={name}
                icon={<User size={12} />}
                className="sm:col-span-2"
              />
              <InfoField
                label="Alamat Email"
                value={email}
                icon={<Mail size={12} />}
                isMono
                className="normal-case not-italic text-zinc-500 font-medium"
              />
              <InfoField
                label="Nomor Induk Identitas"
                value={nimNip}
                icon={<Hash size={12} />}
                isMono
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
