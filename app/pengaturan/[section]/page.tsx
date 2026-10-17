import { notFound } from "next/navigation";
import { SettingsSection, SettingsSectionScreen } from "@/components/settings-screens";

const sections = ["tema", "notifikasi", "privasi", "bahasa", "bantuan", "tentang"];

export default async function Page({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!sections.includes(section)) notFound();
  return <SettingsSectionScreen section={section as SettingsSection} />;
}
