import PrayerTabs from "@/components/PrayerTabs";

export const metadata = { title: "Prayer" };

export default function Prayer() {
  return (
    <div className="py-8">
      <h1 className="page-title">Prayer</h1>
      <p className="page-lead">Read a prayer and make it your own, or share what is on your heart and let others pray with you.</p>
      <div className="mt-8">
        <PrayerTabs />
      </div>
    </div>
  );
}
