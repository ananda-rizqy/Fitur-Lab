import { PageLayout } from "../../../layouts/PageLayout";
import { TabelManajemenTendik } from "../../../components/organism/TabelManajemenTendik";

export const KalebDashboard = () => {
  return (
    <PageLayout 
      pageTitle="Manajemen Kaleb" 
      pageDescription="Atur penugasan gedung untuk staf laboratorium."
    >
      <div className="py-6 w-full">
        <TabelManajemenTendik />
      </div>
    </PageLayout>
  );
};