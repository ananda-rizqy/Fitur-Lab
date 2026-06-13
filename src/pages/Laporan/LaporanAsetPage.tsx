import { useState } from "react";
import { LaporanAset } from "../../components/organism/Laporan/LaporanAset";
import { PageLayout } from "../../layouts/PageLayout";
import { LoanFilterCard } from "../../components/molecules/LoanFilterCard";

export const LaporanAsetPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleClearFilters = () => {
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <PageLayout 
      pageTitle="Laporan Penggunaan Aset" 
      pageDescription="Rekapitulasi akumulasi durasi penggunaan alat laboratorium."
    >
      <div className="py-6 w-full space-y-6">
        
        {/* Filter Card - Menggunakan komponen yang sama dengan riwayat peminjaman */}
        <LoanFilterCard
          startDate={startDate}
          endDate={endDate}
          searchQuery={searchQuery}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onSearchChange={setSearchQuery}
          onClear={handleClearFilters}
        />

        {/* Tabel Laporan - Mengirim filter sebagai props */}
        <LaporanAset 
          searchQuery={searchQuery}
          startDate={startDate}
          endDate={endDate}
        />
      </div>
    </PageLayout>
  );
};