import { useEffect, useState } from "react";
import api from "../../services/api";
import { RandomPickerCard } from "../../components/organism/RandomPickerCard";
import { GroupGeneratorCard } from "../../components/organism/GroupGeneratorCard";
import { StudentCard } from "../../components/molecules/StudentCard";
import { Users, Grid, Loader2 } from "lucide-react";
import { PageLayout } from "../../layouts/PageLayout";

interface Student {
  id: number;
  nama: string;
  name: string;
  nim: string;
  kelas?: string;
}

export function ClassPage() {
  const [user, setUser] = useState<Student | null>(null);
  const [classmates, setClassmates] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState<Student | null>(null);
  const [isPicking, setIsPicking] = useState(false);

  const [groupCount, setGroupCount] = useState(3);
  const [groups, setGroups] = useState<Student[][]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let currentClass = "";
        let token = localStorage.getItem("token");
        const authStorage = localStorage.getItem("auth");

        if (authStorage) {
          const parsedAuth = JSON.parse(authStorage);
          const userData = parsedAuth.user || parsedAuth;
          if (userData.role !== 'mahasiswa') {
  }
          setUser(userData);
          currentClass = userData?.kelas || "";
        }

        if (!token && authStorage) {
          token = JSON.parse(authStorage)?.token || null;
        }

        const classRes = await api.get("/mahasiswa", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const allStudents = classRes.data?.data || classRes.data || [];

        if (
          currentClass &&
          Array.isArray(allStudents) &&
          allStudents.length > 0
        ) {
          const kelasUserNormalized = currentClass
            .trim()
            .toLowerCase()
            .replace(/[- ]/g, "");

          const sameClassmates = allStudents.filter((student) => {
            if (!student.kelas) return false;

            const kelasMhsNormalized = student.kelas
              .toString()
              .trim()
              .toLowerCase()
              .replace(/[- ]/g, "");

            return kelasMhsNormalized === kelasUserNormalized;
          });

          setClassmates(sameClassmates);
        } else {
          setClassmates(Array.isArray(allStudents) ? allStudents : []);
        }
      } catch (err) {
        console.error("Gagal memuat ekosistem kelas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRandomPick = () => {
    if (!classmates.length) return;
    setIsPicking(true);

    let counter = 0;
    const interval = setInterval(() => {
      const randomUser =
        classmates[Math.floor(Math.random() * classmates.length)];
      setSelected(randomUser);
      counter++;

      if (counter > 12) {
        clearInterval(interval);
        setIsPicking(false);
      }
    }, 70);
  };

  const handleGenerateGroups = () => {
    if (!classmates.length) return;
    setIsGenerating(true);

    setTimeout(() => {
      const shuffled = [...classmates].sort(() => Math.random() - 0.5);
      const result: Student[][] = Array.from(
        { length: Math.max(1, groupCount) },
        () => [],
      );

      shuffled.forEach((student, index) => {
        result[index % groupCount].push(student);
      });

      setGroups(result);
      setIsGenerating(false);
    }, 400);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-950 dark:text-zinc-100" />
        <p className="text-[10px] font-mono font-black tracking-widest text-zinc-400 uppercase">
          Sinkronisasi Data Kelas
        </p>
      </div>
    );
  }

  return (
    <PageLayout
      pageTitle="Ruang Kelas"
      pageDescription="Manajemen data rekan sejawat, pembagian kelompok praktikum otomatis, dan pengundian acak mahasiswa."
    >
      <div className="py-6 w-full space-y-8 antialiased text-left bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-300">
        <div className="relative overflow-hidden bg-zinc-950 dark:bg-zinc-900 p-6 lg:p-8 text-white border-2 border-zinc-950 dark:border-zinc-800  group">
          <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-5 pointer-events-none transition-transform duration-700 group-hover:scale-105">
            <Users size={280} />
          </div>
          <div className="relative z-10 space-y-3">
            <span className="text-[9px] bg-zinc-900 dark:bg-zinc-800 border border-zinc-800 text-zinc-300 px-3 py-1.5 font-mono font-black tracking-widest rounded-none uppercase">
              Ruang Kelas
            </span>
            <h1 className="text-3xl font-black tracking-tight mt-1 font-mono">
              {user?.name || "N/A"}
            </h1>
            <div className="flex items-center">
              <p className="text-zinc-400 font-medium text-xs flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-zinc-100 animate-pulse" />
                Kelas:{" "}
                <span className="font-mono font-black text-white">
                  {user?.kelas || "TIDAK TERDETEKSI"}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 w-full">
          <div className="lg:col-span-2">
            <RandomPickerCard
              selected={selected}
              isPicking={isPicking}
              onPick={handleRandomPick}
            />
          </div>
          <div className="lg:col-span-3">
            <GroupGeneratorCard
              groupCount={groupCount}
              setGroupCount={setGroupCount}
              groups={groups}
              isGenerating={isGenerating}
              onGenerate={handleGenerateGroups}
            />
          </div>
        </div>

        <section className="space-y-4 w-full">
          <div className="flex items-center justify-between border-b-2 border-zinc-200 dark:border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Grid className="text-zinc-400 dark:text-zinc-600" size={16} />
              <h2 className="text-sm font-mono font-black tracking-widest text-zinc-900 dark:text-zinc-200 ">
                Daftar Teman Kelas{" "}
                <span className="text-xs text-zinc-400 font-mono font-bold tracking-normal">
                  ({classmates.length} Personel)
                </span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
            {classmates.map((item) => (
              <StudentCard key={item.id} nama={item.nama} nim={item.nim} />
            ))}
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
