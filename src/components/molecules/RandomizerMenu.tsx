import { useState } from "react";
import { Button } from "../ui/button";


interface RandomizerMenuProps {
    classmates: any[];
}

export function RandomizerMenu({ classmates }: RandomizerMenuProps) {
    const [groupCount, setGroupCount] = useState(2);
    const [groups, setGroups] = useState<any[][]>([]);

    const generateGroups = () => {
        if (classmates.length === 0) return;

        // Shuffle algorithm (Fisher-Yates)
        const shuffled = [...classmates].sort(() => Math.random() - 0.5);
        const result: any[][] = Array.from({ length: groupCount }, () => []);

        shuffled.forEach((person, index) => {
            result[index % groupCount].push(person);
        });

        setGroups(result);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* KIRI: KONTROL */}
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm">
                    <h3 className="font-black text-slate-800 dark:text-white uppercase text-sm mb-6 text-indigo-600">Config Kelompok</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase block mb-2">Jumlah Kelompok</label>
                            <input
                                type="number"
                                min="1"
                                max={classmates.length}
                                value={groupCount}
                                onChange={(e) => setGroupCount(parseInt(e.target.value))}
                                className="w-full p-4 rounded-2xl border-2 border-slate-100 dark:bg-slate-800 outline-none focus:border-indigo-500 font-bold"
                            />
                        </div>

                        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100">
                            <p className="text-[10px] font-bold text-indigo-600 uppercase">Status Ruangan</p>
                            <p className="text-xl font-black">{classmates.length} Mahasiswa Hadir</p>
                        </div>

                        <Button onClick={generateGroups} className="w-full py-8 rounded-3xl bg-indigo-600 font-black tracking-widest">
                            ACAK KELOMPOK SEKARANG
                        </Button>
                    </div>
                </div>
            </div>

            {/* KANAN: HASIL ACAK */}
            <div className="lg:col-span-8">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm min-h-[400px]">
                    <h3 className="font-black text-slate-800 dark:text-white uppercase text-sm mb-6">Hasil Pembagian Kelompok</h3>

                    {groups.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-400 italic">
                            <p>Belum ada kelompok yang dibuat.</p>
                            <p className="text-xs">Klik tombol acak di sebelah kiri.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {groups.map((group, idx) => (
                                <div key={idx} className="p-6 rounded-3xl  bg-slate-50/30 dark:bg-slate-800/50">
                                    <h4 className="font-black text-indigo-600 mb-3 uppercase text-xs tracking-widest">Kelompok {idx + 1}</h4>
                                    <ul className="space-y-2">
                                        {group.map((member, mIdx) => (
                                            <li key={mIdx} className="flex items-center gap-3">
                                                <div className="w-6 h-6 bg-white dark:bg-slate-700 rounded-lg flex items-center justify-center text-[10px] font-black ">
                                                    {mIdx + 1}
                                                </div>
                                                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{member.nama_mahasiswa || member.name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}